import { Router } from 'express';
import {
  signup,
  login,
  getProfile,
  logout,
  googleAuth,
  googleSignupComplete,
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

/**
 * @route   POST /Profile/google-auth
 * @desc    Check Google account and Login/Signup
 * @access  Public
 */
router.post('/google-auth', googleAuth);

/**
 * @route   POST /Profile/google-signup-complete
 * @desc    Finalize Google signup with username/branch
 * @access  Public
 */
router.post('/google-signup-complete', googleSignupComplete);

export default router;
