import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken } from '../config/firebase';

export interface FirebaseAuthRequest extends Request {
  firebaseUser?: {
    uid: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

export const authenticateFirebase = async (req: FirebaseAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Firebase authentication token is required' },
    });
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    req.firebaseUser = {
      uid: decoded.uid,
      email: decoded.email,
      name: (decoded as any).name || 'Operator',
      role: (decoded as any).role || 'OPERATOR',
    };
    next();
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: error.message },
    });
  }
};
