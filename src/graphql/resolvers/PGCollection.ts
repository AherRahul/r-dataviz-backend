import { AppContext, IDataSource } from "../../interfaces/auth.interface";
import { IQueryProp } from "../../interfaces/datasource.interface";
import { DatasourceService } from "../../services/DatasourceService";
import { executePostgreSQLQuery, getPostgreSQLCollections } from "../../services/PGConnection";
import { authenticateGraphQLRoute } from "../../utils/token-util";

export const PostgreSQLCollectionResolver = {
  Query: {
    async getPostgreSQLCollections(_: undefined, args: {projectId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { projectId } = args;

      const projectIds: IDataSource[] = await DatasourceService.getDataSources(`${req.currentUser?.userId}`);

      const collections: string[] = await getPostgreSQLCollections(projectId);

      return {
        projectIds,
        collections
      }
    },
    async getSinglePostgreSQLCollections(_: undefined, args: {projectId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { projectId } = args;

      req.session = {
        ...req.session,
        activeProject: { projectId, type: 'postgresql' }
      }

      const collections: string[] = await getPostgreSQLCollections(projectId);

      return collections;
    },
    async executePostgreSQLQuery(_: undefined, args: {data: IQueryProp}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { data } = args;

      const documents: Record<string, unknown>[] = await executePostgreSQLQuery(data);

      return {
        documents: JSON.stringify(documents)
      };
    }
  }
};
