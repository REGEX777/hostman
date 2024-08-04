import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import express from 'express';
import mongoose from 'mongoose';


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

const upload = multer({
    storage: storage
})




router.get("/", (req, res)=>{
    res.json({"error": "Req type not supported."})
})

router.post('/', upload.single('file'), (req, res)=>{
    console.log(req.file);
    
    res.json({"body": req.key })
})


export default router;