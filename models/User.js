import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '/images/default-profile.png', // Default profile picture
    },
    bio: {
        type: String,
        default: 'Hello, I am a new user!',
    },
    socialLinks: {
        website: { type: String },
        twitter: { type: String },
        instagram: { type: String },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    apiKey: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);
export default User;
