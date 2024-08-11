import express from 'express';
import { requireLogin } from '../middleware/auth.js';
import ErrorLog from '../models/ErrorLog.js';

const router = express.Router();

// GET logs page
router.get('/logs', requireLogin, async (req, res) => {
    try {
        const logs = await ErrorLog.find().sort({ timestamp: -1 });
        res.render('logs', { logs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve logs.');
    }
});

export default router;
