import { AppDataSource } from "@/database/config";
import { ChartInfo } from "@/entities/chartInfo.entity";
import { ICreatedChartInfo } from "@/interfaces/datasource.interface";
import { GraphQLError } from "graphql";
import { omit } from "lodash";


export class ChartInfoService {
  static async createNewChartInfo(data: ICreatedChartInfo): Promise<ICreatedChartInfo> {
    try {
      const chartInfoRepository = AppDataSource.getRepository(ChartInfo);
      const result = await chartInfoRepository.save(data);
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getUserCharts(userId: string): Promise<ICreatedChartInfo[]> {
    try {
      const chartInfoRepository = AppDataSource.getRepository(ChartInfo);
      const charts: ICreatedChartInfo[] = await chartInfoRepository.find({
        relations: {
          datasource: true
        },
        select: {
          datasource: {
            projectId: true
          }
        },
        order: {
          createdAt: 'DESC'
        },
        where: {
          userId
        }
      }) as unknown as ICreatedChartInfo[];
      const transformedCharts: ICreatedChartInfo[] = charts.map((chart: ICreatedChartInfo) => ({
        ...chart,
        projectId: (chart as any).datasource?.projectId
      }));
      return transformedCharts;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getChartInfoById(chartId: string): Promise<ICreatedChartInfo> {
    try {
      const chartInfoRepository = AppDataSource.getRepository(ChartInfo);
      const chart: ICreatedChartInfo = await chartInfoRepository.findOne({
        relations: {
          datasource: true
        },
        select: {
          datasource: {
            projectId: true
          }
        },
        order: {
          createdAt: 'DESC'
        },
        where: {
          id: chartId
        }
      }) as unknown as ICreatedChartInfo;
      const transformedChart: ICreatedChartInfo = {
        ...chart,
        projectId: (chart as any).datasource?.projectId
      };
      return transformedChart;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async updateChartInfo(chartId: string, data: ICreatedChartInfo): Promise<ICreatedChartInfo> {
    try {
      const chartInfoRepository = AppDataSource.getRepository(ChartInfo);
      const updatedData = omit(data, ['createdAt']);
      await chartInfoRepository.update({id: chartId}, updatedData);
      const chart = await this.getChartInfoById(chartId);
      return chart;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async deleteChartInfo(chartId: string): Promise<void> {
    try {
      const chartInfoRepository = AppDataSource.getRepository(ChartInfo);
      await chartInfoRepository.delete({id: chartId});
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }
}
