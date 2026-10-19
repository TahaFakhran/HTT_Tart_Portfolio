# Portfolio — Artist Portfolio

A full-stack artist portfolio with a Japanese manga-artbook visual direction, responsive masonry gallery, English/French interface, project detail pages, and a protected admin area. There are no demo projects or preview images: the portfolio displays media uploaded through the admin panel and content stored in MariaDB.

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4 and custom CSS design tokens
- React Router
- Node.js + Express + TypeScript
- MariaDB
- JWT admin authentication, bcrypt password hashing, Zod validation, Multer uploads

## Requirements
- Node.js 20.19+ (or 22.12+)
- MariaDB 10.6+

## Setup (Windows PowerShell)
1. From the project root, install dependencies:
   ```powershell
   npm install
   ```
2. Copy the environment template and edit `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
   Configure `DB_NAME=portfolio`, `DB_USER=taha`, the database password, a random `JWT_SECRET` of at least 32 characters, and `ADMIN_PASSWORD` when ready to enable admin login.
3. Ensure the MariaDB database `portfolio` and user `taha` exist, and grant the user permissions on `portfolio.*`.
4. Create the tables and insert text defaults/categories:
   ```powershell
   npm run db:migrate
   npm run db:seed
   ```
   The seed script does **not** create demo projects or images. It creates an admin account only when a non-placeholder `ADMIN_PASSWORD` is configured. The migration creates the initial schema and should be run against a new/empty database.
5. Start the frontend and API:
   ```powershell
   npm run dev
   ```
6. Open `http://localhost:5173`. Admin: `http://localhost:5173/admin`. API health: `http://localhost:4000/api/health`.

## Content and images
- English is the default language. The EN / FR toggle switches the interface language and remembers the choice in local storage.
- Static interface text is stored in `client/src/locales/en.ts` and `client/src/locales/fr.ts`. Keep the same translation keys in both files. `client/src/lib/i18n.tsx` provides the `useLanguage()` hook and typed `t('key')` helper.
- Project titles and descriptions are content data stored in MariaDB with separate English/French fields.
- Homepage headline/subtitle, hero image/video, About biography/image, contact email and social URLs are managed from the admin panel and stored in `site_settings`.
- Mark a project as **Feature on homepage** to show it in the homepage masonry section. Unfeatured projects appear in the full Projects gallery only.
- Project covers and the homepage hero can be JPEG, PNG, WebP, GIF, MP4 or WebM. The About image accepts image formats only. Files live under `uploads/projects/`; MariaDB stores file paths, not blobs.
- `client/src/components/MediaRenderer.tsx` is the shared image/video rendering component.
- The admin currently creates/deletes projects and manages site settings. Editing existing projects and managing multiple extra media files per project can be added later.

## Where to change things
- Public page layouts: `client/src/pages/`
- Shared UI: `client/src/components/`
- Visual design: `client/src/styles.css`
- Interface translations: `client/src/locales/en.ts` and `client/src/locales/fr.ts`
- Frontend API calls: `client/src/lib/api.ts`
- Backend endpoints: `server/src/routes/`
- File uploads: `server/src/services/uploads.ts`
- Database schema: `database/migrations/001_initial.sql`
- Default text and category setup: `server/src/db/seed.ts`

## Useful commands
```powershell
npm run dev
npm run build
npm run db:migrate
npm run db:seed
```

## GitHub
Create an empty repository and run from the project root:
```powershell
git init
git add .
git commit -m "Initial portfolio application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Never commit `.env`, passwords, JWT secrets, or private artwork. `uploads/projects/` is intentionally ignored by Git, so back up that folder separately if it contains uploaded artwork.

## Before production
- Set a strong admin password and unique JWT secret.
- Serve the API over HTTPS behind your reverse proxy.
- Restrict CORS to your actual public origin.
- Consider additional contact-form spam protection.
- Back up MariaDB and the `uploads/` directory together.
