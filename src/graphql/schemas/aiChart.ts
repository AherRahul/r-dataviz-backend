import { buildSchema } from "graphql";

export const aiChartSchema = buildSchema(`#graphql
    input AiChartQuery {
      projectId: String!
      userPrompt: String!
      chartType: String!
    }

    input AiSQLQuery {
      projectId: String!
      prompt: String!
    }

    type Query {
      getSQLQueryData(info: AiSQLQuery!): String!
      generateChart(info: AiChartQuery!): String!
    }
`);
