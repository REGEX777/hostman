import express from 'express';
import mongoose from 'mongoose';
import Album from '../models/Album.js';
import Post from '../models/Post.js';

const router = express.Router();
import { requireLogin } from '../middleware/auth.js';


// GET - Create Album page
router.get('/create', requireLogin, async (req, res) => {
    try {
        const userImages = await Post.find({});
        res.render('createAlbum', { userImages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

router.post('/create', requireLogin, async (req, res) => {
    try {
        const { name, imageIds } = req.body;
        // convert the ids to the fucking object ids man pls for fuck sakes
        const imageIdsArray = imageIds ? imageIds.split(',').map(id => {
            id = id.trim(); // will remove the whitepsace

            if (mongoose.Types.ObjectId.isValid(id)) {
                return new mongoose.Types.ObjectId(id); 
            } else {
                console.error(`bad id: ${id}`);
                return null;
            }
        }).filter(id => id !== null) : []; // keel the bad ids

        const album = new Album({
            name,
            user: req.user._id,
            images: imageIdsArray
        });

        await album.save();
        req.flash('success', 'Album created successfully!');
        res.redirect('/albums');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to create album.');
        res.redirect('/albums/create');
    }
});


router.get('/', requireLogin, async (req, res) => {
    try {
        const albums = await Album.find({ user: req.user._id }).populate('images');
        res.render('albums', { albums });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // testing if its a valid id or noooooooooooot
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid album ID');
        }

        const album = await Album.findById(id).populate('images');
        
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.render('album', { album, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});
export default router;
