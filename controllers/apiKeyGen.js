import crypto from 'crypto';

const generateApiKey = () => {
    return crypto.randomBytes(20).toString('hex').slice(0, 20);
};


export default generateApiKey;