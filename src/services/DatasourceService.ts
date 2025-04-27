import { AppDataSource } from "../database/config";
import { ChartInfo } from "../entities/chartInfo.entity";
import { Datasource } from "../entities/datasource.entity";
import { IDataSource } from "../interfaces/auth.interface";
import { IDataSourceDocument, IDataSourceProjectID } from "../interfaces/datasource.interface";
import { decodeBase64 } from "../utils/utils";
import { GraphQLError } from "graphql";

export class DatasourceService {
  static async createNewDataSource(data: IDataSourceDocument): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result = await datasourceRepository.save(data);
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSourceByProjectId(projectid: string): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument = await datasourceRepository.findOne({
        where: { projectId: projectid }
      }) as unknown as IDataSourceDocument;
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSourceById(datasourceId: string): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument = await datasourceRepository.findOne({
        where: { id: datasourceId }
      }) as unknown as IDataSourceDocument;
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSources(userid: string): Promise<IDataSource[]> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument[] = await datasourceRepository.find({
        where: { userId: userid },
        order: { createdAt: 'DESC' }
      }) as unknown as IDataSourceDocument[];
      const datasources: IDataSource[] = result.map((item) => {
        const { id, projectId, type, databaseName } = item;
        return {
          id,
          projectId,
          type,
          database: databaseName && databaseName.length > 0 ? decodeBase64(databaseName) : ''
        }
      }) as IDataSource[];
      return datasources;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async editDataSource(data: IDataSourceDocument): Promise<IDataSourceProjectID[]> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      await datasourceRepository.update({id: data.id}, data);
      const result: IDataSourceProjectID[] = await this.getDataSources(`${data.userId}`);
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async deleteDatasource(datasourceId: string): Promise<boolean> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(ChartInfo, {
        datasourceId
      });

      await queryRunner.manager.delete(Datasource, {
        id: datasourceId
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();
      throw new GraphQLError('Failed to delete datasource')
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}
