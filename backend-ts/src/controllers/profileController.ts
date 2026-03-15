import { Request, Response } from 'express';
import { pool } from '../config/db';
import { createUser, comparePassword } from '../models/Profile';
import { generateToken } from '../middleware/jwt';

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
      'SELECT id FROM profiles WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: 'Email already in use',
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
      'SELECT * FROM profiles WHERE username = $1',
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
