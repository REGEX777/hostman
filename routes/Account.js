import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';
import ApiKeyLog from '../models/ApiKeyLog.js'; // Assuming you have a model for logging API key usage
import { requireLogin } from '../middleware/auth.js';
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

router.get('/', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render('account', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

router.post('/regenerate-api-key', requireLogin, async (req, res) => {
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

router.post('/delete', requireLogin, async (req, res) => {
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

router.post('/upload-profile-pic', requireLogin, upload.single('profilePic'), async (req, res) => {
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

router.post('/change-password', requireLogin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            req.flash('error_message', 'Current password is incorrect.');
            return res.redirect('/account');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        req.flash('success_message', 'Password changed successfully.');
        res.redirect('/account');
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Failed to change password.');
        res.redirect('/account');
    }
});

export default router;
