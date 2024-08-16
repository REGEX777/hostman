import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path'
import fs from 'fs';
import { requireLogin } from '../middleware/auth.js';
import apiLogger from '../middleware/apiLogger.js';
import internet from '../internet.json'

// Model Import

import Post from '../models/Post.js';
import User from '../models/User.js'

// Middleware
import verifyApiKey from '../middleware/apiAuth.js'

const router = express.Router();
// Logger
router.use(apiLogger);


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




router.get("/", (req, res)=>{
    res.json({"error": "Req type not supported."})
})



router.post('/upload/:apiKey', verifyApiKey, upload.single('file'), async (req, res) => {
    const now = new Date();
    const uploadIp = req.ip;

    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }

    try {
        const post = {
            fileName: req.file.filename,
            fileSize: req.file.size,
            fileUploadTime: now,
            fileUploadIp: uploadIp,
            fileType: req.file.mimetype,
            owner: req.user.id
        };

        await Post.create(post);
        console.log('[INFORMATION]> Image uploaded successfully and details were saved in the database.');
        res.status(200).send(`${internet.domain}/${req.file.filename}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

router.delete('/post/:id', async (req, res)=>{
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


router.post('/upload', requireLogin, async (req, res) => {
    if (!req.files || !req.files.image) {
        req.flash('error', 'No image uploaded');
        return res.redirect('/upload');
    }

    const imageFile = req.files.image;
    const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);

    try {
        // Check if the file is an image
        if (!imageFile.mimetype.startsWith('image/')) {
            req.flash('error', 'Only image files are allowed');
            return res.redirect('/upload');
        }

        // Move image to the uploads folder
        await imageFile.mv(uploadPath);

        // Save image details to the database
        const newImage = new Image({
            title: req.body.title,
            description: req.body.description,
            imageUrl: `/uploads/${imageFile.name}`,
            owner: req.user._id,
        });
        await newImage.save();

        req.flash('success', 'Image uploaded successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to upload image');
        res.redirect('/upload');
    }
});



export default router;