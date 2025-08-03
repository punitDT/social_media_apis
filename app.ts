// app.ts

import express, { Application, Request, Response } from 'express';
import authRoutes from './routes/auth_routes';
import unauthRoutes from './routes/unauth_routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth/api/', authRoutes);
app.use('/api/', unauthRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Social Media API (TypeScript)' });
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
    console.error('Error:', error);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
