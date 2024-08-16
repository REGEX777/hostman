import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { requireLogin } from '../middleware/auth.js';


const router = express.Router();
//POST - image toggle
// toggle the postssssssss
router.post('/toggle/:imageId', requireLogin, async (req, res) => {
    try {
        const { imageId } = req.params;
        const user = req.user;

        if (user.favorites.includes(imageId)) {
            // if already favorite kick it out
            user.favorites = user.favorites.filter(id => id.toString() !== imageId);
            await user.save();
            req.flash('success', 'Image removed from favorites.');
        } else {
            // if not adddddddddd itttttt 
            user.favorites.push(imageId);
            await user.save();
            req.flash('success', 'Image added to favorites.');
        }

        res.redirect('back');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not update favorite status.');
        res.redirect('back');
    }
});

// GET - View all favorite images
router.get('/', requireLogin, async (req, res) => {
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
