import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewere to log the logs in a file called apilogs.txt
const apiLogger = (req, res, next) => {
    const logFilePath = path.join(__dirname, '../logs/Apilogs.txt');
    const logEntry = `${new Date().toISOString()} | IP: ${req.ip} | Method: ${req.method} | Route: ${req.originalUrl}\n`;

    
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });

    next(); 
};

export default apiLogger;