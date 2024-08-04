import express from 'express';

// Model import
import Post from '../models/Post.js'

const router = express.Router();

router.get("/:filename", async(req, res)=>{
    const post = await Post.findOne({fileName: req.params.filename})
    if(!post){
        res.json({"Error":"Post not found"})
    }

    res.render('postPage', {post: post})
})

export default router;