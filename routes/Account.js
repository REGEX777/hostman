import express from 'express';
import User from '../models/User.js';
import { ensureAuthenticated } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET account page
router.get('/account', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render('account', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

// POST to regenerate API key
router.post('/account/regenerate-api-key', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        user.apiKey = uuidv4().replace(/-/g, '');
        await user.save();

        req.flash('success_message', 'API Key regenerated successfully.');
        res.redirect('/account');
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Failed to regenerate API Key.');
        res.redirect('/account');
    }
});

export default router;
