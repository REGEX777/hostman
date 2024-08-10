import express from 'express';
import bcrypt from 'bcryptjs';
import {
    v4 as uuidv4
} from 'uuid';
import User from '../models/User.js';
import {
    check,
    validationResult
} from 'express-validator';

const router = express.Router();


import generateApiKey from '../controllers/apiKeyGen.js';

// Signup route
router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
    .isLength({
        min: 8
    }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\W/).withMessage('Password must contain at least one special character'),
], async (req, res) => {
    try {
        const existingUser = await User.findOne();
        if (existingUser) {
            return res.status(403).json({
                message: 'Signup disabled. User already exists.'
            });
        }

        const {
            email,
            password
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = generateApiKey()

        const newUser = new User({
            email,
            password: hashedPassword,
            apiKey
        });
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error logging in after signup.'
                });
            }
            return res.status(201).json({
                message: 'User created successfully.',
                apiKey
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server error. Please try again.'
        });
    }
});




router.post('/signup',
    [
        check('username').not().isEmpty().withMessage('Username is required'),
        check('email').isEmail().withMessage('Enter a valid email'),
        check('password').isLength({
            min: 6
        }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('signup', {
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;

        try {
            const existingUser = await User.findOne({
                username
            });
            if (existingUser) {
                req.flash('error', 'Username already taken');
                return res.redirect('/signup');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });

            await newUser.save();
            req.flash('success', 'Registration successful, please log in');
            res.redirect('/login');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Failed to register user');
            res.redirect('/signup');
        }
    }
);


export default router;