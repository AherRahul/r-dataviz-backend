import { AppContext, IAuth, IDataSource } from "@/interfaces/auth.interface";
import { IAuthPayload } from "@/interfaces/datasource.interface";
import { getPostgreSQLCollections } from "../../services/PGConnection";
import { AuthService } from "@/services/auth/AuthService";
import { DatasourceService } from "../../services/DatasourceService";
import { authenticateGraphQLRoute } from "@/utils/token-util";

export const AuthResolver = {
  Query: {
    async checkCurrentUser(_: undefined, __: undefined, contextValue: AppContext) {
      const { req } = contextValue;

      console.log(req);

      authenticateGraphQLRoute(req);

      console.log(authenticateGraphQLRoute(req));

      let collections: string[] = [];
      const result: IDataSource[] = await DatasourceService.getDataSources(`${req.currentUser?.userId}`);

      console.log(result);

      if (result.length > 0) {
        const activeProject = req.currentUser?.activeProject ? req.currentUser?.activeProject : result[0];
        if (activeProject.type === 'postgresql') {
          collections = await getPostgreSQLCollections(activeProject.projectId);
        }
      }

      return {
        user: {
          id: req.currentUser?.userId,
          email: req.currentUser?.email
        },
        projectIds: result,
        collections,
      }
    }

  },
  Mutation: {
    async loginUser(_: undefined, args: { email: string; password: string }, contextValue: AppContext) {
      const { req } = contextValue;
      const user: IAuth = { email: args.email, password: args.password };

      // Call your auth service for login, which should return user data
      const result: IAuthPayload = await AuthService.login(user, contextValue);

      // If login is successful, save user info in session
      if (result && result.user?.id) {
        req.session = {
          userId: result.user.id,
          email: result.user.email,
          activeProject: result.user.activeProject || null,
        };
        console.log('✅ Session set:', req.session);
      } else {
        console.warn('⚠️ Login failed, session not set');
      }

      return result;
    }
};
