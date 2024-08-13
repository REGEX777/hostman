// Keydetails.js
import express from 'express';

// Model import

import Post from '../models/Post.js'
import { requireLogin } from '../middleware/auth.js';

const router = express.Router();

router.get("/",requireLogin, (req, res) => {
    const user = req.user;
    Post.find({}).then((posts)=>{
        res.render('index', {posts: posts, user: user})
    }).catch(err=>console.log(err))
});

export default router;
