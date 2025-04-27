import { Pool, PoolClient } from "pg";
import { IDataSourceDocument, IQueryProp } from "../interfaces/datasource.interface";
import { GraphQLError } from "graphql";
import { DatasourceService } from "../services/DatasourceService";
import { base64Decoded } from "../utils/utils";

export async function testPostgreSQLConnection(data: IDataSourceDocument): Promise<string> {
  let client: PoolClient | null = null;
  const { databaseName, databaseUrl, username, password, port } = data;
  const pool: Pool = new Pool({
    host: databaseUrl,
    user: username,
    password,
    port: parseInt(`${port}`, 10) ?? 5432,
    database: databaseName,
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 second of connection could not be established
    maxUses: 7500, // Number of times a connection can be used before being closed
    ssl: {
      rejectUnauthorized: false, // very important for Supabase
    },
  });

  try {
    client = await pool.connect();

    try {
      await client.query('SELECT 1');
    } catch (error: any) {
      console.error('Database query error:', error.message);
      // Don't let your server crash!
    }

    return 'Successfully connected to PostgreSQL';
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function getPostgreSQLCollections(projectId: string, schema: string = 'public'): Promise<string[]> {
  let client: PoolClient | null = null;

  try {
    const project = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;
    const pool: Pool = new Pool({
      host: base64Decoded(databaseUrl!)!,
      user: base64Decoded(username!)!,
      password: base64Decoded(password!)!,
      port: parseInt(`${port}`, 10) ?? 5432,
      database: base64Decoded(databaseName!)!,
      max: 20, // Maximum number of clients in pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 second of connection could not be established
      maxUses: 7500, // Number of times a connection can be used before being closed
      ssl: {
        rejectUnauthorized: false, // very important for Supabase
      },
    });

    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    client = await pool.connect();

    let tables = [];

    try {
      const result = await client.query(query, [schema]);
      tables = result.rows.map((row) => row.table_name);
    } catch (error: any) {
      console.error('Database query error:', error.message);
      // Don't let your server crash!
    }

    return tables;
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function executePostgreSQLQuery(data: IQueryProp): Promise<Record<string, unknown>[]> {
  let client: PoolClient | null = null;

  try {
    const { projectId, sqlQuery } = data;
    const project = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;
    const pool: Pool = new Pool({
      host: base64Decoded(databaseUrl!)!,
      user: base64Decoded(username!)!,
      password: base64Decoded(password!)!,
      port: parseInt(`${port}`, 10) ?? 5432,
      database: base64Decoded(databaseName!)!,
      max: 20, // Maximum number of clients in pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 second of connection could not be established
      maxUses: 7500, // Number of times a connection can be used before being closed
      ssl: {
        rejectUnauthorized: false, // very important for Supabase
      },
    });

    client = await pool.connect();
    let result;
    try {
      result = await client.query(sqlQuery);
    } catch (error: any) {
      console.error('Database query error:', error?.message);
      // Don't let your server crash!
    }
    return result?.rows ?? [];
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) {
      client.release();
    }
  }
}
