import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const failedLoginAttempts = {};

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: (req) => failedLoginAttempts[req.body.email] >= 5 ? 0 : 5,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    skipSuccessfulRequests: true,
});

const logAttempt = (email, ip, success) => {
    const logFilePath = path.join(__dirname, 'login-attempts.log');
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    const logMessage = `${timestamp} - Login ${status} for email: ${email} from IP: ${ip}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Failed to log login attempt:', err);
    });
};

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', loginLimiter, (req, res, next) => {
    const email = req.body.email;
    const ip = req.ip || req.connection.remoteAddress;

    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
            logAttempt(email, ip, false);
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            delete failedLoginAttempts[email];
            logAttempt(email, ip, true);
            return res.redirect('/');
        });
    })(req, res, next);
});

export default router;
