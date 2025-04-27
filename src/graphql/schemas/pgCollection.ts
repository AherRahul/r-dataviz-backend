import { buildSchema } from 'graphql';

export const postgresqlCollectionSchema = buildSchema(`#graphql
    input PostGresqlExecution {
      projectId: String!
      sqlQuery: String!
    }

    type DataSource {
      id: String
      projectId: String!
      type: String!
      database: String
    }

    type CollectionResponse {
      collections: [String]
      projectIds: [DataSource]
    }

    type QueryResponse {
      documents: String
    }

    type Query {
      getPostgreSQLCollections(projectId: String!): CollectionResponse
      getSinglePostgreSQLCollections(projectId: String!): [String]
      executePostgreSQLQuery(data: PostGresqlExecution!): QueryResponse!
    }
`);
