import express from 'express';

import Post from '../models/Post.js';
import EmbedConfig from '../models/embedConfig.js';

const router = express.Router();

router.get("/:filename", async (req, res) => {
    try {
        const post = await Post.findOne({ fileName: req.params.filename });
        if (!post) {
            return res.json({ "Error": "Post not found" });
        }

        const embedConfig = await EmbedConfig.findOne();

        res.render('postPage', { post, embedConfig });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;
