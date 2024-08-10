import express from 'express';
import Comment from '../models/Comment.js';
import Image from '../models/Image.js';

const router = express.Router();

// POST - Add a new comment to an image
router.post('/:imageId', async (req, res) => {
    try {
        const image = await Image.findById(req.params.imageId);
        if (!image) {
            req.flash('error', 'Image not found');
            return res.redirect('back');
        }

        const comment = new Comment({
            text: req.body.text,
            postedBy: req.user._id,
            image: image._id
        });

        await comment.save();
        req.flash('success', 'Comment added successfully');
        res.redirect(`/images/${image._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add comment');
        res.redirect('back');
    }
});

export default router;
