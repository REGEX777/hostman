import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js'; 
import ApiKeyLog from '../models/ApiKeyLog.js'; // Assuming you have a model for logging API key usage
import { ensureAuthenticated } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pics');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

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

        // Log the API key regeneration
        const apiKeyLog = new ApiKeyLog({
            userId: user._id,
            action: 'Regenerated API Key',
            details: `API Key regenerated on ${new Date().toLocaleString()}`
        });
        await apiKeyLog.save();

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
        // Find user and delete
        await User.findByIdAndDelete(req.user._id);

        // Logout user
        req.logout(err => {
            if (err) {
                return res.status(500).send('Error logging out after account deletion.');
            }
            req.flash('success_message', 'Account deleted successfully.');
            res.redirect('/signup'); // Redirect to signup or login page after deletion
        });
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Failed to delete account.');
        res.redirect('/account');
    }
});

// POST to upload profile picture
router.post('/account/upload-profile-pic', ensureAuthenticated, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        user.profilePic = `/uploads/profile_pics/${req.file.filename}`;
        await user.save();

        req.flash('success_message', 'Profile picture uploaded successfully.');
        res.redirect('/account');
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Failed to upload profile picture.');
        res.redirect('/account');
    }
});

export default router;
