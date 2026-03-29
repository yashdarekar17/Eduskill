import { Request, Response } from 'express';
import { pool } from '../config/db';
import { createUser, comparePassword } from '../models/Profile';
import { generateToken } from '../middleware/jwt';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.CLIENT_ID);

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, name, Branch, Email, password } = req.body;

    // Map frontend field names to lowercase for DB
    const branch = Branch;
    const email = Email;

    // Validate input (mobileno is optional)
    if (!username || !name || !branch || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM profiles WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)',
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: 'Email or Username already in use',
      });
      return;
    }

    // Create new profile
    const newProfile = await createUser({
      name,
      username,
      branch,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newProfile.id,
        username: newProfile.username,
        email: newProfile.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
      return;
    }

    // Find user by username
    const result = await pool.query(
      'SELECT * FROM profiles WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
      return;
    }

    // Compare passwords
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
    console.log(token);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Select all columns EXCEPT password
    const result = await pool.query(
      'SELECT id, name, username, branch, email, created_at FROM profiles WHERE id = $1',
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
    console.log(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @desc    Initial Google authentication check
 * @access  Public
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token: idToken, intent } = req.body; // intent can be 'login' or 'signup'

    if (!idToken) {
      res.status(400).json({ success: false, message: 'ID Token is required' });
      return;
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(401).json({ success: false, message: 'Invalid token payload' });
      return;
    }

    const { email, name, sub: googleId } = payload;
    const lowerEmail = email.toLowerCase();

    // Check if user exists by googleId OR email (case-insensitive)
    const result = await pool.query(
      'SELECT * FROM profiles WHERE google_id = $1 OR LOWER(email) = $2',
      [googleId, lowerEmail]
    );
    const user = result.rows[0];

    // Handle existing user
    if (user) {
      // If intent is signup, inform the user they already have an account
      if (intent === 'signup') {
        res.status(409).json({
          success: false,
          message: 'Account already exists. Please login instead.',
          exists: true
        });
        return;
      }

      // If intent is login (or not specified), proceed to login
      // If the account was a standard account (no google_id), link it now
      if (!user.google_id) {
        await pool.query(
          'UPDATE profiles SET google_id = $1 WHERE id = $2',
          [googleId, user.id]
        );
        user.google_id = googleId; // Update local user object
      }

      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        isNew: false,
        token,
        user: { id: user.id, username: user.username, email: user.email, name: user.name }
      });
      return;
    }

    // Case: Totally new user (Needs Profile Completion)
    // Suggest a username from full name
    const suggestedUsername = name?.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);

    res.status(200).json({
      success: true,
      needs_completion: true,
      isNew: true,
      userData: {
        email,
        name,
        googleId,
        suggestedUsername
      }
    });

  } catch (error: any) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Google authentication failed' 
    });
  }
};

/**
 * @desc    Complete signup for Google users
 * @access  Public
 */
export const googleSignupComplete = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, googleId, username, branch } = req.body;

    if (!email || !name || !googleId || !username || !branch) {
      res.status(400).json({ success: false, message: 'Missing completion data' });
      return;
    }

    // Double check email/username uniqueness (case-insensitive)
    const check = await pool.query(
      'SELECT * FROM profiles WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)',
      [email, username]
    );
    if (check.rows.length > 0) {
       res.status(409).json({ success: false, message: 'Email or Username already taken' });
       return;
    }

    // Create user without password
    const result = await pool.query(
      'INSERT INTO profiles (name, username, branch, email, google_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, username, branch, email, googleId]
    );
    const user = result.rows[0];

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Registration completed',
      token,
      user: { id: user.id, username: user.username, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error('Google Signup Error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete Google signup' });
  }
};
