import { Router } from 'express';
import {
  signup,
  login,
  getProfile,
  logout,
} from '../controllers/profileController';
import { jwtWebMiddleware } from '../middleware/jwt';

const router = Router();

/**
 * @route   POST /Profile/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /Profile/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /Profile/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', jwtWebMiddleware, getProfile);

/**
 * @route   POST /Profile/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', jwtWebMiddleware, logout);

export default router;
