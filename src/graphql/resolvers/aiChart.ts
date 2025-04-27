import { AppContext } from "../../interfaces/auth.interface";
import { IAiChartInfo, IAiSqlQuery } from "../../interfaces/datasource.interface";
import { generateChart, getSQLQueryData } from "../../services/AIChartService";
import { authenticateGraphQLRoute } from "../../utils/token-util";

export const AiChartResolver = {
  Query: {
    async getSQLQueryData(_: undefined, args: {info: IAiSqlQuery}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { info } = args;
      const result = await getSQLQueryData(info);
      return JSON.stringify(result);
    },
    async generateChart(_: undefined, args: {info: IAiChartInfo}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { info } = args;
      const result = await generateChart(info);
      return JSON.stringify(result);
    }
  },
};
