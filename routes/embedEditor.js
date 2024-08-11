import express from 'express';
import Image from '../models/Image.js'; // Assuming you have an Image model

const router = express.Router();

// Get the editor page
router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image not found');
        }
        res.render('embedEditor', { image });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update the embed meta
router.post('/:id', async (req, res) => {
    const { title, description, color } = req.body;
    try {
        let image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image not found');
        }

        image.embedMeta = {
            title: title || image.embedMeta.title,
            description: description || image.embedMeta.description,
            color: color || image.embedMeta.color,
        };

        await image.save();
        res.redirect(`/embedEditor/${image._id}`);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
