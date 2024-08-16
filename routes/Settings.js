import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, 'config.json');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.get('/', async (req, res) => {
  try {
    const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    res.render('editConfig', { config });
  } catch (err) {
    console.error('Error reading config file:', err);
    res.status(500).send('Failed to load config');
  }
});

router.post('/', async (req, res) => {
  const updatedConfig = req.body;

  try {
    await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2));
    // this shud update the config file everywhere in the cookie
    router.locals.config = updatedConfig;
    res.redirect('/edit-config');
  } catch (err) {
    console.error('Error writing config file:', err);
    res.status(500).send('Failed to save config');
  }
});

export default router
