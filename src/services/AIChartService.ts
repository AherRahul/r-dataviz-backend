import { envConfig } from "@/config/env.config";
import { IAiChartInfo, IAiSqlQuery, IDataSourceDocument, ISQLQueryData } from "@/interfaces/datasource.interface";
import Anthropic from "@anthropic-ai/sdk";
import { Pool, PoolClient, QueryResult } from "pg";
import { DatasourceService } from "@/services/DatasourceService";
import { base64Decoded } from "@/utils/utils";
import { GraphQLError } from "graphql";
import { ToolUseBlock } from "@anthropic-ai/sdk/resources";
import { CHART_TYPE_PROMPTS, generateChartPrompt, MODEL_TOOLS, sqlGeneratorPrompt, sqlPromptMessage, SYSTEM_PROMPT } from "./ChartPrompt";

const anthropicClient = new Anthropic({
  apiKey: envConfig.CLAUDE_API_KEY
});

export async function generateChart(info: IAiChartInfo) {
  let client: PoolClient | null = null;
  let pool: Pool | null = null;
  try {
    const { projectId, userPrompt, chartType } = info;
    let promptResult: ToolUseBlock | null = null;

    const project: IDataSourceDocument = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;
    pool = pgPool(
      base64Decoded(databaseUrl!)!,
      base64Decoded(username!)!,
      base64Decoded(password!)!,
      port!,
      base64Decoded(databaseName!)!
    );
    client = await pool.connect();
    const schema: string = await getTableSchema(client);
    const content: string = sqlPromptMessage(schema, userPrompt);

    const sql: string = await aiSQLGenerator(content);
    const queryResult: QueryResult = await client.query(sql);

    if (queryResult.rows.length > 0) {
      const chartPrompt: string = CHART_TYPE_PROMPTS[chartType as keyof typeof CHART_TYPE_PROMPTS] || '';
      const message: string = generateChartPrompt(userPrompt, chartType, chartPrompt, JSON.stringify(queryResult.rows));

      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        temperature: 0.3,
        tools: MODEL_TOOLS,
        tool_choice: { type: 'auto' },
        messages: [{ role: 'user', content: message }],
        system: SYSTEM_PROMPT
      });
      const toolUseContent: Anthropic.Messages.ToolUseBlock | undefined = response.content.find((res) => res.type === 'tool_use');
      promptResult = toolUseContent ? toolUseContent : null;
    }

    return {
      promptResult,
      queryResult: queryResult.rows,
      sql
    };
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) {
      client.release();
    }
    if (pool) {
      await pool.end();
    }
  }
}

export async function getSQLQueryData(data: IAiSqlQuery): Promise<ISQLQueryData> {
  let client: PoolClient | null = null;
  let pool: Pool | null = null;
  try {
    const { projectId, prompt } = data;
    const project: IDataSourceDocument = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;
    pool = pgPool(
      base64Decoded(databaseUrl!)!,
      base64Decoded(username!)!,
      base64Decoded(password!)!,
      port!,
      base64Decoded(databaseName!)!
    );
    client = await pool.connect();
    const schema: string = await getTableSchema(client);
    const message: string = sqlGeneratorPrompt(schema, prompt);

    const sql: string = await aiSQLGenerator(message);
    const result: QueryResult = await client.query(sql);
    return { result: result.rows ?? [], sql };
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) {
      client.release();
    }
    if (pool) {
      await pool.end();
    }
  }
}

async function getTableSchema(client: PoolClient): Promise<string> {
  const schemaQuery: string = `
    SELECT
      t.table_name,
      array_agg(
        c.column_name || ' ' || c.data_type ||
        CASE
          WHEN c.is_nullable = 'NO' THEN ' NOT NULL'
          ELSE ''
        END ||
        CASE
          WHEN EXISTS (
            SELECT 1 FROM information_schema.key_column_usage k
            WHERE k.table_name = t.table_name AND k.column_name = c.column_name
          ) THEN ' PRIMARY KEY'
          ELSE ''
        END ||
        CASE
          WHEN c.column_default IS NOT NULL THEN ' DEFAULT ' || c.column_default
          ELSE ''
        END
      ) as columns
    FROM
      information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE
      t.table_schema = 'public'
    GROUP BY
      t.table_name;
  `;
  const schema: QueryResult = await client.query(schemaQuery);
  return schema.rows.map((row) => `Table ${row.table_name}:\n  ${row.columns.join(',\n  ')}`).join('\n\n');
}

async function aiSQLGenerator(message: string): Promise<string> {
  const sqlGeneration = await anthropicClient.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    // temperature: 0.7
    messages: [
      {
        role: 'user',
        content: message
      }
    ]
  });
  const sql: string = (sqlGeneration.content[0] as any).text.trim();
  return sql;
}

function pgPool(host: string, username: string, password: string, port: string, dbName: string): Pool {
  const pool: Pool = new Pool({
    host,
    user: username,
    password: password,
    port: parseInt(`${port}`, 10) ?? 5432,
    database: dbName,
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 second of connection could not be established
    maxUses: 7500 // Number of times a connection can be used before being closed
  });
  return pool;
}
