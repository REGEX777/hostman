import mongoose from 'mongoose';

const embedConfigSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    footer: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: '#FFFFFF',
    },
    thumbnailUrl: {
        type: String,
        default: '',
    },
    authorName: {
        type: String,
        default: '',
    },
    authorIconUrl: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: null,
    },
});

const EmbedConfig = mongoose.model('EmbedConfig', embedConfigSchema);

export default EmbedConfig;
