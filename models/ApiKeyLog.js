import mongoose from 'mongoose';

const apiKeyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ApiKeyLog = mongoose.model('ApiKeyLog', apiKeyLogSchema);

export default ApiKeyLog;
