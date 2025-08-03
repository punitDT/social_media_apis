

/// list registered users
import { Request, Response, NextFunction } from 'express';


/// route
import express, { Router } from 'express';

import { listUsers } from '../../controllers/user';

const router: Router = express.Router();

router.get('/users', listUsers);

export default router;  