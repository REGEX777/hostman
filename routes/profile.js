import express from 'express';
import User from '../models/User.js';
import Image from '../models/Image.js';
import { ensureAuthenticated } from '../middleware/auth.js'; // A middleware to ensure the user is authenticated

const router = express.Router();

// GET - View Profile
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('images');
        const images = await Image.find({ owner: req.user._id });

        res.render('profile/view', { user, images });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load profile');
        res.redirect('/');
    }
});

// POST - Update Profile
router.post('/edit', ensureAuthenticated, async (req, res) => {
    const { bio, website, twitter, instagram } = req.body;

    try {
        await User.findByIdAndUpdate(req.user._id, {
            bio,
            socialLinks: { website, twitter, instagram },
        });

        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update profile');
        res.redirect('/profile');
    }
});

export default router;
