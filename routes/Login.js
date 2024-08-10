import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const failedLoginAttempts = {};

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    skip: (req) => {
        const email = req.body.email;
        return !failedLoginAttempts[email] || failedLoginAttempts[email] < 3;
    }
});

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', loginLimiter, (req, res, next) => {
    const email = req.body.email;
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
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
