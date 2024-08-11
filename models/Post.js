import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
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
    fileName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    fileUploadTime: {
        type: Date,
        default: Date.now,
    },
    fileUploadIp: {
        type: String,
        required: true,
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
