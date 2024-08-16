import express from 'express';
import Post from '../models/Post.js';
import { requireLogin } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id',requireLogin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('embedEditor', { post });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/:id',requireLogin, async (req, res) => {
    const { title, description, color } = req.body;
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        post.embedMeta = {
            title: title || post.embedMeta.title,
            description: description || post.embedMeta.description,
            color: color || post.embedMeta.color,
        };

        await post.save();
        res.redirect(`/embedEditor/${post._id}`);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
});

export default router;
