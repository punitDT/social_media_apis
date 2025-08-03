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

export default app;
