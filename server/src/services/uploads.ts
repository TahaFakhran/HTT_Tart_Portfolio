import path from 'node:path';import fs from 'node:fs';import multer from 'multer';import {randomUUID} from 'node:crypto';import {fileURLToPath} from 'node:url';
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
export const uploadDir=path.resolve(projectRoot,process.env.UPLOAD_DIR??'./uploads/projects');
fs.mkdirSync(uploadDir,{recursive:true});
const allowed=new Set(['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']);
const storage=multer.diskStorage({destination:(_req,_file,cb)=>cb(null,uploadDir),filename:(_req,file,cb)=>{const ext=path.extname(file.originalname).toLowerCase();cb(null,`${randomUUID()}${ext}`)}});
export const upload=multer({storage,limits:{fileSize:100*1024*1024,files:3},fileFilter:(_req,file,cb)=>{if(!allowed.has(file.mimetype))return cb(new Error('Only JPEG, PNG, WebP, GIF, MP4 or WebM files are allowed'));cb(null,true)}});
export function publicUploadPath(filename:string){return `/uploads/${filename}`}
export function mediaTypeFromFile(file?:Express.Multer.File):'image'|'gif'|'video'{if(file?.mimetype.startsWith('video/'))return 'video';if(file?.mimetype==='image/gif')return 'gif';return 'image'}
export function removeUpload(url:string){if(!url.startsWith('/uploads/'))return;const filename=path.basename(url);const file=path.join(uploadDir,filename);if(fs.existsSync(file))fs.unlinkSync(file)}
