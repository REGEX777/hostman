import mongoose from 'mongoose';

const embedConfigSchema = new mongoose.Schema({
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
    authorName: {
        type: String,
        default: '',
    },
    authorIconUrl: {
        type: String,
        default: '',
    }
});

const EmbedConfig = mongoose.model('EmbedConfig', embedConfigSchema);

export default EmbedConfig;
