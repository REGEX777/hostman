import express from 'express';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { requireLogin } from '../middleware/auth.js';


const router = express.Router();
// GET logs page
router.get('/', requireLogin, async (req, res) => {
    const logFilePath = path.join(__dirname, '../logs/Apilogs.txt');

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the logs file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('logs', { logs: data });
    });
});

export default router;
