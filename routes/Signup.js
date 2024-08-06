import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js'; 
const router = express.Router();


import generateApiKey from '../controllers/apiKeyGen.js';

// Signup route
router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', async (req, res) => {
    try {
        const existingUser = await User.findOne();
        if (existingUser) {
            return res.status(403).json({ message: 'Signup disabled. User already exists.' });
        }

        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = generateApiKey()

        const newUser = new User({ email, password: hashedPassword, apiKey });
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in after signup.' });
            }
            return res.status(201).json({ message: 'User created successfully.', apiKey });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

export default router;
