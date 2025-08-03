

/// manage all unauth routes

import express, { Router } from 'express';

import userRoutes from './user/unauth';

const router: Router = express.Router();

router.use('/user', userRoutes);

export default router;  