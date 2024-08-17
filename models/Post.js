import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
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
