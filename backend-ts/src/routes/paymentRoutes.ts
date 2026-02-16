import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController';

const router = Router();

/**
 * @route   POST /createOrder
 * @desc    Create a Razorpay order
 * @access  Public
 */
router.post('/createOrder', createOrder);

/**
 * @route   POST /verifyPayment
 * @desc    Verify Razorpay payment
 * @access  Public
 */
router.post('/verifyPayment', verifyPayment);

export default router;
