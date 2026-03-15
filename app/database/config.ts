import pkg from "pg";
const { Pool } = pkg;

// Création de la connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query<
  T extends import("pg").QueryResultRow = import("pg").QueryResultRow,
>(text: string, params?: any[]): Promise<import("pg").QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Exécute un update ou insert
 * @param text - La requête SQL
 * @param params - Les paramètres de la requête
 */
export async function update(
  text: string,
  params?: any[],
): Promise<import("pg").QueryResult> {
  return pool.query(text, params);
}

/**
 * Crée les tables passées en paramètre
 * @param tables - Requête SQL ou tableau de requêtes SQL
 */
export async function createTables(tables: string | string[]): Promise<void> {
  if (Array.isArray(tables)) {
    for (const table of tables) {
      await query(table);
    }
  } else {
    await query(tables);
  }
}
