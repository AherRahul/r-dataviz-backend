import { IDataSource } from "./auth.interface";

export interface IDataSourceDocument {
  id?: string;
  userId?: string;
  projectId: string;
  databaseUrl?: string;
  createdAt?: Date;
  type?: string;
  port?: string;
  databaseName?: string;
  username?: string;
  password?: string;
}

export interface IDataSourceProjectID {
  id?: string;
  projectId: string;
  type: string;
  database?: string;
}

export interface IQueryProp {
  projectId: string;
  sqlQuery: string;
}

export interface ICreatedChartInfo {
  id?: string;
  datasourceId: string;
  projectId?: string;
  userId: string;
  chartName: string;
  chartType: string;
  xAxis: string;
  yAxis: string;
  queryData: string;
  chartData: string;
  prompt: string;
  sql: string;
  createdAt: Date | string;
}

export interface IAiChartInfo {
  projectId: string;
  userPrompt: string;
  chartType: string;
}

export interface IAiSqlQuery {
  projectId: string;
  prompt: string;
}

export interface IAuthPayload {
  collections: string[];
  projectIds: IDataSource[];
  user: {
    id: string;
    email: string;
  };
}

export interface ISQLQueryData {
  result: Record<string, unknown>[];
  sql: string;
}
