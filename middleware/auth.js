export function requireLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // redirect to login page if not authenticated
}
