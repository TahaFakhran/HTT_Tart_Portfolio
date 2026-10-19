import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';
import { mediaTypeFromFile, publicUploadPath, removeUpload, upload } from '../services/uploads.js';

const router = Router();
const settingsUpload = upload.fields([
  { name: 'home_hero_image_file', maxCount: 1 },
  { name: 'about_image_file', maxCount: 1 },
]);

async function readSettings() {
  const rows = await pool.query('SELECT setting_key, setting_value FROM site_settings');
  return Object.fromEntries(rows.map((row: { setting_key: string; setting_value: string }) => [row.setting_key, row.setting_value]));
}

router.get('/', async (_req, res, next) => {
  try { res.json(await readSettings()); } catch (error) { next(error); }
});

router.get('/admin/settings', requireAdmin, async (_req, res, next) => {
  try { res.json(await readSettings()); } catch (error) { next(error); }
});

router.put('/admin/settings', requireAdmin, settingsUpload, async (req, res, next) => {
  const uploaded = req.files as Record<string, Express.Multer.File[]> | undefined;
  try {
    const data = z.record(z.string().min(1).max(100), z.string().max(10000)).parse(req.body);
    const current = await readSettings();
    const heroFile = uploaded?.home_hero_image_file?.[0];
    const aboutFile = uploaded?.about_image_file?.[0];

    if (aboutFile && !aboutFile.mimetype.startsWith('image/')) {
      if (heroFile) removeUpload(publicUploadPath(heroFile.filename));
      removeUpload(publicUploadPath(aboutFile.filename));
      return res.status(400).json({ error: 'The About page image must be an image file.' });
    }

    if (heroFile) {
      data.home_hero_image = publicUploadPath(heroFile.filename);
      data.home_hero_media_type = mediaTypeFromFile(heroFile);
    }
    if (aboutFile) data.about_image = publicUploadPath(aboutFile.filename);

    for (const [key, value] of Object.entries(data)) {
      await pool.query(
        'INSERT INTO site_settings(setting_key, setting_value) VALUES(?, ?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)',
        [key, value],
      );
    }

    if (heroFile && current.home_hero_image && current.home_hero_image !== data.home_hero_image) removeUpload(current.home_hero_image);
    if (aboutFile && current.about_image && current.about_image !== data.about_image) removeUpload(current.about_image);
    res.json({ ok: true, settings: await readSettings() });
  } catch (error) {
    if (uploaded?.home_hero_image_file?.[0]) removeUpload(publicUploadPath(uploaded.home_hero_image_file[0].filename));
    if (uploaded?.about_image_file?.[0]) removeUpload(publicUploadPath(uploaded.about_image_file[0].filename));
    next(error);
  }
});

export default router;
