import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { getDirname } from '@/components/getFromFile.js';

export async function runMigrations(dbClient: Client) {
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { rows } = await dbClient.query('SELECT filename FROM _migrations');
  const executedMigrations = rows.map(row => row.filename);

  const __dirname = getDirname(import.meta.url);
  const migrationsDir = path.join(__dirname, '/migrations'); 
  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    if (file.endsWith('.sql') && !executedMigrations.includes(file)) {

      console.log(`💾 Applying the update: ${file}...`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        await dbClient.query('BEGIN'); 
        await dbClient.query(sql);
        await dbClient.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
        await dbClient.query('COMMIT'); 
        console.log(`💾 ${file} apply with success!`);
      } catch (error) {
        await dbClient.query('ROLLBACK');
        console.error(`💾 Error occurred while applying ${file}:`, error);
        throw error;
      }
    }
  }
}