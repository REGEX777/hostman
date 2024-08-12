import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

// POST - Add an image to favorites
router.post('/add/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        const user = req.user;

        if (!user.favorites.includes(imageId)) {
            user.favorites.push(imageId);
            await user.save();
            req.flash('success', 'Image added to favorites.');
        } else {
            req.flash('info', 'Image is already in your favorites.');
        }

        res.redirect('back');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not add image to favorites.');
        res.redirect('back');
    }
});

// POST - Remove an image from favorites
router.post('/remove/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        const user = req.user;

        user.favorites = user.favorites.filter(id => id.toString() !== imageId);
        await user.save();
        req.flash('success', 'Image removed from favorites.');

        res.redirect('back');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not remove image from favorites.');
        res.redirect('back');
    }
});

// GET - View all favorite images
router.get('/', async (req, res) => {
    try {
        const user = req.user;
        const favoriteImages = await Post.find({ _id: { $in: user.favorites } });
        res.render('favorites', { favoriteImages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

export default router;
