import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import express from 'express';


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
    storage: multer
})




router.get("/", (req, res)=>{
    res.json({"error": "Req type not supported."})
})

router.post('/', (req, res)=>{
    console.log(req.body);
    
    res.json({"body": req.body })
})


export default router;