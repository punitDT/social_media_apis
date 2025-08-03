

/// authentication middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    /// check if user is authenticated using auth token
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    /// check bearer token
    const token = req.headers.authorization.split(' ')[1];

    /// check if JWT secret is configured
    const jwtSecret = process.env.JWT_TOKEN;
    if (!jwtSecret) {
        return res.status(500).json({ message: 'JWT secret not configured' });
    }

    /// verify jwt token
    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.body.userId = decoded.id;
        next();
    });
};