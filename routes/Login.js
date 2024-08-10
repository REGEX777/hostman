import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const failedLoginAttempts = {};

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: (req) => failedLoginAttempts[req.body.email] >= 5 ? 0 : 5,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    skipSuccessfulRequests: true,
});

const logFailedAttempt = (email) => {
    const logFilePath = path.join(__dirname, 'failed-logins.log');
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - Failed login attempt for email: ${email}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Failed to log failed login attempt:', err);
    });
};

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', loginLimiter, (req, res, next) => {
    const email = req.body.email;
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
            logFailedAttempt(email);
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            delete failedLoginAttempts[email];
            return res.redirect('/');
        });
    })(req, res, next);
});

export default router;
