import { AiChartResolver } from "./aiChart";
import { AuthResolver } from "./auth";
import { ChartInfoResolver } from "./chartInfo";
import { CoreDatasourceResolver } from "./datasource";
import { PostgreSQLCollectionResolver } from "./PGCollection";

export const mergedGQLResolvers = [
  AuthResolver,
  CoreDatasourceResolver,
  PostgreSQLCollectionResolver,
  AiChartResolver,
  ChartInfoResolver
];
