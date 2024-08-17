import express from 'express';
import EmbedConfig from '../models/embedConfig.js';
import { requireLogin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
    try {
        let embedConfig = await EmbedConfig.findOne();
        if (!embedConfig) {
            embedConfig = new EmbedConfig(); 
            await embedConfig.save();
        }
        res.render('embedEditor', { post: embedConfig });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/', requireLogin, async (req, res) => {
    const { description, footer, color, authorName, authorIconUrl, timestamp } = req.body;
    try {
        let embedConfig = await EmbedConfig.findOne();
        if (!embedConfig) {
            embedConfig = new EmbedConfig(); 
        }

        embedConfig.description = description || embedConfig.description;
        embedConfig.footer = footer || embedConfig.footer;
        embedConfig.color = color || embedConfig.color;
        embedConfig.authorName = authorName || embedConfig.authorName;
        embedConfig.authorIconUrl = authorIconUrl || embedConfig.authorIconUrl;

        await embedConfig.save();
        res.redirect('/embedEditor');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

export default router;
