import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileUploadTime: { type: Date, default: Date.now },
    fileUploadIp: { type: String, required: true },
    fileType: { type: String, required: true } // Add this field
});

export default mongoose.model('Post', postSchema);
