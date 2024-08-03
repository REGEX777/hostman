// Home.js
import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.render('api')
});

export default router;
