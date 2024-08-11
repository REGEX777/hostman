import express from 'express';
import User from '../models/User.js';
import ApiKeyLog from '../models/ApiKeyLog.js'; // Adjust according to your actual model
import { requireLogin } from '../middleware/auth.js';

const router = express.Router();

// GET activity dashboard
router.get('/dashboard', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const apiKeyUsage = await ApiKeyLog.find({ userId: req.user._id }).countDocuments();
        // Add other statistics as needed
        res.render('dashboard', { user, apiKeyUsage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

export default router;
