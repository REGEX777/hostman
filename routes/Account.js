import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; 
import ApiKeyLog from '../models/ApiKeyLog.js'; // Assuming you have a model for logging API key usage
import { ensureAuthenticated } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET account page
router.get('/account', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const apiKeyLogs = await ApiKeyLog.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.render('account', { user, apiKeyLogs });
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

// POST to delete account
router.post('/account/delete', ensureAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        req.logout(err => {
            if (err) {
                return res.status(500).send('Error logging out after account deletion.');
            }
            req.flash('success_message', 'Account deleted successfully.');
            res.redirect('/signup');
        });
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Failed to delete account.');
        res.redirect('/account');
    }
});

export default router;
