import 'dotenv/config';
import mariadb from 'mariadb';
export const pool = mariadb.createPool({host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3306),database:process.env.DB_NAME??'portfolio',user:process.env.DB_USER??'taha',password:process.env.DB_PASSWORD??'',connectionLimit:10,charset:'utf8mb4'});
