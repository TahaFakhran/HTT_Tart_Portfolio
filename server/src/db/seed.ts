import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

try {
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD;

  if (password && password !== 'SET_A_STRONG_PASSWORD_HERE') {
    const existing = await pool.query('SELECT id FROM admin_users WHERE email = ? LIMIT 1', [email]);
    if (!existing[0]) {
      const passwordHash = await bcrypt.hash(password, 12);
      await pool.query('INSERT INTO admin_users(email, password_hash) VALUES(?, ?)', [email, passwordHash]);
      console.log(`Created admin account: ${email}`);
    } else {
      console.log(`Admin account already exists: ${email}`);
    }
  } else {
    console.log('Admin user not created: set ADMIN_PASSWORD in .env when you are ready to enable admin login.');
  }

  // Only text defaults are seeded. Artwork and videos must be uploaded from the admin panel.
  const settings: Record<string, string> = {
    hero_title_en: 'Drawn in ink.\nBrought to life.',
    hero_title_fr: 'Dessiner à l’encre.\nDonner vie.',
    hero_subtitle_en: 'Illustration · Manga studies · 2D animation',
    hero_subtitle_fr: 'Illustration · Études manga · Animation 2D',
    about_en: 'I am an independent artist exploring character, atmosphere and movement through illustration and animation.',
    about_fr: 'Je suis un artiste indépendant qui explore les personnages, les ambiances et le mouvement à travers l’illustration et l’animation.',
    contact_email: '',
    instagram_url: '',
    artstation_url: '',
  };
  for (const [key, value] of Object.entries(settings)) {
    await pool.query(
      'INSERT INTO site_settings(setting_key, setting_value) VALUES(?, ?) ON DUPLICATE KEY UPDATE setting_key=VALUES(setting_key)',
      [key, value],
    );
  }

  const categories = ['Illustration', 'Animation', 'Digital Art', 'Studies', 'Character Design'];
  for (const [index, name] of categories.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await pool.query(
      'INSERT INTO categories(name, slug, sort_order) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE sort_order=VALUES(sort_order)',
      [name, slug, index],
    );
  }

  console.log('Default site text and categories seeded. No demo projects or images were added.');
} catch (error) {
  console.error('Seed failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
