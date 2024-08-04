import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import passport from 'passport';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in after signup.' });
            }
            return res.status(201).json({ message: 'User created successfully.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

export default router;
