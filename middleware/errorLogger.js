import ErrorLog from '../models/ErrorLog.js'; // Assuming you create an ErrorLog model

const errorLogger = async (err, req, res, next) => {
    try {
        const errorLog = new ErrorLog({
            userId: req.user ? req.user._id : null,
            message: err.message,
            stack: err.stack,
            endpoint: req.originalUrl,
            method: req.method,
            ipAddress: req.ip,
            timestamp: new Date(),
        });
        await errorLog.save();
    } catch (logError) {
        console.error('Failed to log error:', logError);
    }
    res.status(500).send('An unexpected error occurred. The issue has been logged.');
};

export default errorLogger;
