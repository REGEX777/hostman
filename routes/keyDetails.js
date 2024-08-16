// Home.js
import express from 'express';

const router = express.Router();

import { requireLogin } from '../middleware/auth.js';
router.get("/", requireLogin,(req, res) => {
    res.render('api')
});

export default router;
