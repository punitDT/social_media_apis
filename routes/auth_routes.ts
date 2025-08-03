

/// manage all auth routes
import express, { Router } from 'express';

import userRoutes from './user/auth';

const router: Router = express.Router();

router.use('/user', userRoutes);

export default router;  