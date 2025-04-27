import { AppContext } from "@/interfaces/auth.interface";
import { ICreatedChartInfo } from "@/interfaces/datasource.interface";
import { ChartInfoService } from "@/services/ChartInfoService";
import { authenticateGraphQLRoute } from "@/utils/token-util";

export const ChartInfoResolver = {
  Query: {
    async getCharts(_: undefined, args: {userId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { userId } = args;
      const response: ICreatedChartInfo[] = await ChartInfoService.getUserCharts(userId);
      return response;
    },
    async getChartInfo(_: undefined, args: {chartId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { chartId } = args;
      const response: ICreatedChartInfo = await ChartInfoService.getChartInfoById(chartId);
      return response;
    },
  },
  Mutation: {
    async createNewChartInfo(_: undefined, args: {data: ICreatedChartInfo}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { data } = args;
      const result: ICreatedChartInfo = await ChartInfoService.createNewChartInfo(data);
      return result;
    },
    async updateChart(_: undefined, args: {chartId: string, data: ICreatedChartInfo}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { chartId, data } = args;
      const result: ICreatedChartInfo = await ChartInfoService.updateChartInfo(chartId, data);
      return result;
    },
    async deleteChart(_: undefined, args: {chartId: string}, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { chartId } = args;
      await ChartInfoService.deleteChartInfo(chartId);
      return {
        id: chartId
      };
    },
  },
  ChartInfoResponse: {
    createdAt: (chart: ICreatedChartInfo) => JSON.stringify(chart.createdAt)
  }
}
