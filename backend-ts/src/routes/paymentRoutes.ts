import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController';
import { jwtWebMiddleware } from '../middleware/jwt';

const router = Router();

/**
 * @route   POST /createOrder
 * @desc    Create a Razorpay order
 * @access  Private (JWT)
 */
router.post('/createOrder', jwtWebMiddleware, createOrder);

/**
 * @route   POST /verifyPayment
 * @desc    Verify Razorpay payment
 * @access  Private (JWT)
 */
router.post('/verifyPayment', jwtWebMiddleware, verifyPayment);

export default router;
