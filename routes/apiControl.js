import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path'

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




router.get("/", (req, res)=>{
    res.json({"error": "Req type not supported."})
})

router.post('/', upload.single('file'), async (req, res)=>{
    const now = new Date();
    
    const newPost = new Post({
        fileName: req.file.filename,
        fileSize: req.file.size,
        fileUploadTime: now,
        fileUploadIp: req.ip
    })

    await newPost.save().then(()=>{
        console.log(`[INFORMATION]> Image uploaded succesfully and the details were saved in the database.`)
    }).catch(err=>console.log(err))

    console.log(Date);
    console.log(req.file.filename);
    
    res.json({"body": req.key })
})


export default router;