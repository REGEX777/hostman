import User from "../models/User";

const verifyApiKey = async (req, res, next) => {
    const apiKey = req.params.apiKey;

    try {
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized. Invalid API key.' });
        }
        // Attach the user to request object for further use if needed
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying API key:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


export default verifyApiKey;