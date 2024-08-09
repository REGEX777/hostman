import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

export default mongoose.model('User', UserSchema);
