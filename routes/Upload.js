import express from 'express';
import multer from 'multer';
import path from 'path';
import Post from '../models/Post.js'; 

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// GET upload page
router.get('/', (req, res) => {
    res.render('upload');
});

// POST upload route
router.post('/', upload.single('file'), async (req, res) => {
    const now = new Date();
    
    const newPost = new Post({
        fileName: req.file.filename,
        fileSize: req.file.size,
        fileUploadTime: now,
        fileUploadIp: req.ip
    });

    await newPost.save()
        .then(() => {
            console.log(`[INFORMATION]> Image uploaded successfully and the details were saved in the database.`);
        })
        .catch(err => console.log(err));

    res.redirect('/upload');
});

export default router;
