import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { pool } from '../config/db';
import * as crypto from 'crypto';

const RAZORPAY_ID_KEY = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_ID_KEY || !RAZORPAY_SECRET_KEY) {
  throw new Error('Razorpay keys are missing in environment variables');
}

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

export const createOrder = async (req: Request, res: Response): Promise<void> => {
try {
    const { name, amount, description } = req.body;
    const idempotencyKey = req.header('Idempotency-Key');
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!idempotencyKey || idempotencyKey.length > 255) {
      res.status(400).json({
        success: false,
        message: 'A valid Idempotency-Key header is required',
      });
      return;
    }

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      res.status(400).json({
        success: false,
        message: 'A valid amount and product name are required',
      });
      return;
    }

    const amountInPaisa = Math.round(amount * 100);

    if (
      !Number.isSafeInteger(amountInPaisa) ||
      amountInPaisa <= 0 ||
      Math.abs(amount * 100 - amountInPaisa) > 0.000001
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
      return;
    }

    const normalizedRequest = {
      name: name.trim(),
      amountInPaisa,
      description: description || '',
    };

    const requestHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(normalizedRequest))
      .digest('hex');

    // Atomically claim the key.
    const inserted = await pool.query(
      `INSERT INTO idempotency_keys
         (user_id, idempotency_key, request_hash, status)
       VALUES ($1, $2, $3, 'processing')
       ON CONFLICT (user_id, idempotency_key) DO NOTHING
       RETURNING id`,
      [String(userId), idempotencyKey, requestHash]
    );

    if (inserted.rowCount === 0) {
      const existing = await pool.query(
        `SELECT request_hash, status, response_status, response_body
         FROM idempotency_keys
         WHERE user_id = $1 AND idempotency_key = $2`,
        [String(userId), idempotencyKey]
      );

      const record = existing.rows[0];

      if (!record) {
        res.status(409).json({
          success: false,
          message: 'Request conflict. Retry using the same key.',
        });
        return;
      }

      if (record.request_hash !== requestHash) {
        res.status(409).json({
          success: false,
          message: 'Idempotency key reused with different request data',
        });
        return;
      }

      if (record.status === 'completed') {
        res.status(record.response_status).json(record.response_body);
        return;
      }

      res.status(409).json({
        success: false,
        message: 'Request is already processing. Retry with the same key.',
      });
      return;
    }

    // Only the request that claimed the key reaches Razorpay.
    const order = await razorpayInstance.orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `order_${crypto.randomUUID()}`,
    });

    const responseBody = {
      success: true,
      msg: 'Order Created',
      order_id: order.id,
      amount: amountInPaisa,
      key_id: RAZORPAY_ID_KEY,
      product_name: name.trim(),
      description: description || '',
      contact: '8567345632',
      name: 'Eduskill User',
      email: 'user@eduskill.com',
    };

    const saved = await pool.query(
      `UPDATE idempotency_keys
       SET status = 'completed',
           response_status = 200,
           response_body = $1,
           razorpay_order_id = $2,
           updated_at = NOW()
       WHERE user_id = $3
         AND idempotency_key = $4
         AND status = 'processing'
       RETURNING id`,
      [
        JSON.stringify(responseBody),
        order.id,
        String(userId),
        idempotencyKey,
      ]
    );

    if (saved.rowCount !== 1) {
      // The Razorpay order exists, but its response wasn't safely stored.
      // Don't create another order automatically.
      res.status(500).json({
        success: false,
        message: 'Order created, but saving its result failed. Contact support.',
      });
      return;
    }

    res.status(200).json(responseBody);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.log('Error verifying payment:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
