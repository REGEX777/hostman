import express from 'express';
import Image from '../models/Image.js';

const router = express.Router();

// GET - Search for images
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.render('search/results', { images: [], query: '' });
    }

    try {
        const images = await Image.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
        });

        res.render('search/results', { images, query });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to search images');
        res.redirect('/');
    }
});

export default router;
