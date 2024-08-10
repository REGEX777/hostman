import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/',loginLimiter, passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/login', 
    failureFlash: true 
}));

export default router;
