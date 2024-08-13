import express from 'express';
import Album from '../models/Album.js';
import Post from '../models/Post.js';

const router = express.Router();

// GET - Create Album page
router.get('/create', async (req, res) => {
    const userImages = await Post.find({})
    res.render('createAlbum', {userImages});
});

router.post('/create', async (req, res) => {
    try {
        const { name, imageIds } = req.body;
        const album = new Album({
            name,
            user: req.user._id,
            images: imageIds // This should be an array of image IDs
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

router.get('/', async (req, res) => {
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
        const album = await Album.findById(req.params.id).populate('images');
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.render('album', { album });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again.');
    }
});

export default router;
