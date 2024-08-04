// Keydetails.js
import express from 'express';

// Model import

import Post from '../models/Post.js'

const router = express.Router();

router.get("/", (req, res) => {
    Post.find({}).then((posts)=>{
        res.render('index', {posts: posts})
    }).catch(err=>console.log(err))
});

export default router;
