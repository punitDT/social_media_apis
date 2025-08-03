

/// register user
import { Request, Response, NextFunction } from 'express';
import models from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/// register user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Username, email, and password are required'
            });
        }

        /// encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await models.users.create({
            username,
            email,
            password: encryptedPassword,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Username or email already exists'
            });
        }
        next(error);
    }
};

/// login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await models.users.findOne({
            where: {
                email,
            },
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        /// check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        /// send signed jwt token
        const auth_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: 86400, // 24 hours
        });

        res.json({
            message: 'User logged in successfully',
            auth_token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

/// list all users
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await models.users.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};