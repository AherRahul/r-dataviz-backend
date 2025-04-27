import { buildSchema } from 'graphql';

export const coreDataSourceSchema = buildSchema(`#graphql
  input DataSourceInfo {
    id: String
    userId: String
    projectId: String
    databaseUrl: String
    port: String
    databaseName: String
    username: String
    password: String
    type: String
  }

  type DataSource {
    id: String
    projectId: String!
    type: String!
    database: String!
  }

  type SingleDataSource {
    id: String
    userId: String
    projectId: String
    databaseUrl: String
    createdAt: String
    type: String
    port: String
    databaseName: String
    username: String
    password: String
  }

  type DataSourceResponse {
    dataSource: [DataSource]
  }

  type DeleteDatasourceResponse {
    id: String!
  }

  type PostgresConnectionResponse {
    message: String!
  }

  type Query {
    getDataSources: DataSourceResponse
    getDataSourceByProjectId(projectId: String!): SingleDataSource
  }

  type Mutation {
    checkPostgresqlConnection(datasource: DataSourceInfo!): PostgresConnectionResponse
    createPostgresqlDataSource(source: DataSourceInfo!): DataSourceResponse!
    editDataSource(source: DataSourceInfo!): DataSourceResponse
    deleteDatasource(datasourceId: String!): DeleteDatasourceResponse
  }
`);
