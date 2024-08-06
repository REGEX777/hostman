import express from 'express';
import User from '../models/User.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/account', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render('account', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

export default router;
