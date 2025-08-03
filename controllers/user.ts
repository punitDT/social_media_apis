

/// register user
import { Request, Response, NextFunction } from 'express';
import models from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/// register user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { username, email, password } = req.body;

        /// encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        await models.users.create({
            username,
            email,
            password: encryptedPassword,
        });


        res.json({ message: 'User registered' });
    } catch (error) {
        next(error);
    }
};

/// login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;

        const user = await models.users.findOne({
            where: {
                email,
            },
        });

        /// check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        /// send signed jwt token
        const auth_token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN || "", {
            expiresIn: 86400, // 24 hours
        });



        res.json({ message: 'User logged in', auth_token });
    } catch (error) {
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