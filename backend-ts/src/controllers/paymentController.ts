import { Request, Response } from 'express';
import Razorpay from 'razorpay';

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

    if (!amount || !name) {
      res.status(400).json({
        success: false,
        message: 'Amount and product name are required',
      });
      return;
    }

    const amountInPaisa = amount * 100;
    const options = {
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    razorpayInstance.orders.create(options, (err: any, order: any) => {
      if (!err) {
        res.status(200).json({
          success: true,
          msg: 'Order Created',
          order_id: order.id,
          amount: amountInPaisa,
          key_id: RAZORPAY_ID_KEY,
          product_name: name,
          description: description || '',
          contact: '8567345632',
          name: 'Eduskill User',
          email: 'user@eduskill.com',
        });
      } else {
        res.status(400).json({
          success: false,
          msg: 'Something went wrong!',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    });
  } catch (error) {
    console.log('Error creating order:', error instanceof Error ? error.message : 'Unknown error');
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
