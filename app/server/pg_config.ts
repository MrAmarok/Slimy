import { Client as PgClient } from 'pg';
import { runMigrations } from './database/runMigration.js';

const databaseUrl = process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database URL: set DATABASE_URL or POSTGRES_URL in environment.",
  );
}

const db = new PgClient({ connectionString: databaseUrl });

export async function connectDatabase() {
  console.log("💾 Connecting to database...");
  
  await db.connect();
  console.log("✅ Connected to database successfully!");
  
  await runMigrations(db); 
}


/**
 * Exécute une requête SQL de type SELECT
 * @param text - La requête SQL
 * @param params - Les paramètres de la requête
 * @returns Une promesse résolvant en résultat de requête
 */
export async function query<
  T extends import("pg").QueryResultRow = import("pg").QueryResultRow,
>(text: string, params?: any[]): Promise<import("pg").QueryResult<T>> {
  return db.query<T>(text, params);
}
