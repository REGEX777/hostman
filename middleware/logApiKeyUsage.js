import ApiKeyLog from '../models/ApiKeyLog.js';

const logApiKeyUsage = async (req, res, next) => {
    if (req.user) {
        try {
            await ApiKeyLog.create({
                userId: req.user._id,
                endpoint: req.originalUrl,
                ipAddress: req.ip
            });
        } catch (err) {
            console.error('Failed to log API key usage:', err);
        }
    }
    next();
};


export default logApiKeyUsage;
