import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import path from 'path';
import fs from 'fs';
import flash from 'connect-flash';
import session from 'express-session';
import mongoose from 'mongoose';
import mime from 'mime-types';

import Post from '../models/Post.js';

const router = express.Router();

router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
router.use(flash());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        const name = `${uuidv4()}.${extension}`;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
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
});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ fileUploadTime: -1 });
        res.render('upload', { message: req.flash('message'), posts });
    } catch (error) {
        req.flash('message', 'Error fetching posts');
        res.redirect('/');
    }
});

router.post('/upload', upload.array('files', 10), async (req, res) => {
    const now = new Date();
    const uploadIp = req.ip;

    if (!req.files || req.files.length === 0) {
        req.flash('message', 'No files were uploaded.');
        return res.redirect('/');
    }

    try {
        const posts = req.files.map(file => ({
            fileName: file.filename,
            fileSize: file.size,
            fileUploadTime: now,
            fileUploadIp: uploadIp,
            fileType: mime.lookup(file.originalname) || 'application/octet-stream'
        }));

        await Post.insertMany(posts);
        req.flash('message', 'Files have been uploaded successfully.');
        res.redirect('/');
    } catch (err) {
        req.flash('message', 'Server error.');
        res.redirect('/');
    }
});

router.delete('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            req.flash('message', 'Post not found');
            return res.redirect('/');
        }

        fs.unlink(__dirname + `/public/uploads/${post.filename}`, (err) => {
            if (err) throw err;
            console.log(`[DEBUG]> Successful deletion of file ${post.filename}`);
        });

        await Post.deleteOne({ _id: postId });

        req.flash('message', 'Post deleted successfully');
        res.redirect('/');
    } catch (error) {
        req.flash('message', 'Internal Server Error');
        res.redirect('/');
    }
});

router.get('/download/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            req.flash('message', 'File not found');
            return res.redirect('/');
        }

        const filePath = path.join(__dirname, `/public/uploads/${post.fileName}`);
        res.download(filePath, post.fileName);
    } catch (error) {
        req.flash('message', 'Error downloading file');
        res.redirect('/');
    }
});

export default router;
