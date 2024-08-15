import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path'
import fs from 'fs';
import { requireLogin } from '../middleware/auth.js';


// Model Import

import Post from '../models/Post.js';


const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        const extension = file.originalname.split('.').pop() // give me the file extension aaaaa
        const name = `${uuidv4()}.${extension}` //new name 
        cb(null, name);
    }
})

const fileFilter = (req, file, cb) => {
    // Accept image files only
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image files are allowed.'));
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})




router.get("/", requireLogin,(req, res)=>{
    res.render('upload')
})



router.post('/', requireLogin, upload.array('files', 10), async (req, res) => {
    const now = new Date();
    const uploadIp = req.ip;

    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    try {
        const posts = req.files.map(file => ({
            owner: req.user._id,
            fileName: file.filename,
            fileSize: file.size,
            fileUploadTime: now,
            fileUploadIp: uploadIp,
            fileType: file.mimetype
        }));

        await Post.insertMany(posts);
        console.log('[INFORMATION]> Images uploaded successfully and details were saved in the database.');
        res.json({ message: 'Files have been uploaded successfully.', files: req.files });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


router.delete('/post/:id', requireLogin, async (req, res)=>{
    try {
        const postId = req.params.id;   

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send('Post not found'); 
        }
        
        fs.unlink(__dirname + `/public/uploads/${post.filename}`, (err) => {
            if (err) throw err;  
            console.log(`[DEBUG]> Successful deletion of file ${post.filename}`);
        });

        await Post.deleteOne({ _id: postId });

        res.status(200).send('Post deleted successfully');  
        console.log(`[DEBUG]> Successful deletion of ID ${postId}`);
    } catch (error) {
        console.error(error);  
        res.status(500).send('Internal Server Error');  
    }
})





export default router;