import express from 'express';
import User from '../models/User.js';
import Image from '../models/Image.js';
import { requireLogin } from '../middleware/auth.js'; // A middleware to ensure the user is authenticated
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET - View Profile
router.get('/', requireLogin, async (req, res) => {
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
router.post('/edit', requireLogin, async (req, res) => {
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

router.post('/edit-profile-picture', requireLogin, async (req, res) => {
    if (!req.files || !req.files.profilePicture) {
        req.flash('error', 'No profile picture uploaded');
        return res.redirect('/profile');
    }

    const newProfilePicture = req.files.profilePicture;
    const uploadPath = path.join(__dirname, '../public/uploads/', newProfilePicture.name);
    const oldProfilePicturePath = path.join(__dirname, '../public', req.user.profilePicture);

    try {
        // Move new profile picture to the uploads folder
        await newProfilePicture.mv(uploadPath);

        // Delete old profile picture if it exists and is not the default one
        if (req.user.profilePicture !== '/images/default-profile.png') {
            fs.unlink(oldProfilePicturePath, (err) => {
                if (err) console.error(`Failed to delete old profile picture: ${err}`);
            });
        }

        // Update user's profile picture in the database
        await User.findByIdAndUpdate(req.user._id, { profilePicture: `/uploads/${newProfilePicture.name}` });

        req.flash('success', 'Profile picture updated successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update profile picture');
        res.redirect('/profile');
    }
});


export default router;
