import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

export const jwtWebMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Get token from Authorization header or cookies
  const authorization = req.headers.authorization;
  const token = authorization ? authorization.split(' ')[1] : req.cookies?.token;

  console.log('🔍 Received Token:', token);

  if (!token) {
    res.status(401).json({ error: 'Token not found' });
    return;
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (userData: any): string => {
  return jwt.sign(userData, process.env.JWT_SECRET as string, {
    expiresIn: '2 days',
  });
};
