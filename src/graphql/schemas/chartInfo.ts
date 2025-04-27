import { buildSchema } from "graphql";

export const chartInfoSchema = buildSchema(`#graphql
  input ChartInfoQuery {
    id: String
    datasourceId: String
    userId: String
    chartName: String
    chartType: String
    xAxis: String
    yAxis: String
    queryData: String
    chartData: String
    prompt: String
    sql: String
  }

  type ChartInfoResponse {
    id: String
    datasourceId: String
    userId: String
    projectId: String
    chartName: String
    chartType: String
    xAxis: String
    yAxis: String
    queryData: String
    chartData: String
    prompt: String
    sql: String
    createdAt: String
  }

  type DeleteChartInfoResponse {
    id: ID!
  }

  type Query {
    getCharts(userId: String!): [ChartInfoResponse]
    getChartInfo(chartId: String!): ChartInfoResponse
  }

  type Mutation {
    createNewChartInfo(data: ChartInfoQuery!): ChartInfoResponse
    updateChart(chartId: String!, data: ChartInfoQuery!): ChartInfoResponse
    deleteChart(chartId: String!): DeleteChartInfoResponse
  }

`);
