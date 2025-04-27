import { mergeTypeDefs } from '@graphql-tools/merge';
import { authSchema } from './auth';
import { postgresqlCollectionSchema } from './pgCollection';
import { coreDataSourceSchema } from './datasource';
import { aiChartSchema } from './aiChart';
import { chartInfoSchema } from './chartInfo';

export const mergedGQLSchema = mergeTypeDefs([
  authSchema,
  postgresqlCollectionSchema,
  coreDataSourceSchema,
  aiChartSchema,
  chartInfoSchema
]);
