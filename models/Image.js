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
        type: String,
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
    embedColor: {
        type: String,
        default: '#FFFFFF', 
    },
    embedThumbnailUrl: {
        type: String,
        default: '', 
    },
    embedAuthorName: {
        type: String,
        default: '', 
    },
    embedAuthorIconUrl: {
        type: String,
        default: '', 
    },
    embedTimestamp: {
        type: Date,
        default: null, 
    },
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
