import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    message: {
        type: String,
        required: true,
    },
    stack: {
        type: String,
        required: true,
    },
    endpoint: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);
export default ErrorLog;
