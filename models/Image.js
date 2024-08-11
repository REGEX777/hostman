import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    tags: {
        type: [String], 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    embedTitle: {
        type: String,
        default: '',
    },
    embedFooter: {
        type: String,
        default: '', 
    },
    embedDescription: {
        type: String,
        default: '', 
    },
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
