import mongoose, { mongo } from "mongoose";


const postSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    fileSize: {
        type: String,
        required: true,
        trim: true
    },
    fileUploadTIme: {
        type: Date, 
        required: true,
        trim: true
    },
    fileUploadIp: {
        type: String,
        required: true,
        trim: true 
    }
})

const Post = mongoose.model('Post', postSchema);


export default Post;