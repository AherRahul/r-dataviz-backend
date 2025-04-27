import { MigrationInterface, QueryRunner } from "typeorm";

export class User1745670545175 implements MigrationInterface {
    name = 'User1745670545175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "datasource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "projectId" character varying NOT NULL, "databaseUrl" character varying, "port" character varying, "databaseName" character varying, "username" character varying, "password" character varying, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5527742558a95839f5e521ada64" UNIQUE ("projectId"), CONSTRAINT "PK_9a969f486c5f1abd362afe73724" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a77ec051ba40e54d6ef05143d" ON "datasource" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5527742558a95839f5e521ada6" ON "datasource" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "chart_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "chartName" character varying NOT NULL, "datasourceId" uuid NOT NULL, "chartType" character varying NOT NULL, "xAxis" character varying NOT NULL, "yAxis" character varying NOT NULL, "prompt" character varying NOT NULL, "queryData" text NOT NULL, "chartData" text NOT NULL, "sql" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec886493273a391a5d7706711e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b5a3367f0acfe4ff52a8093ad" ON "chart_info" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fac2ff11af9ae8efcbbf07177b" ON "chart_info" ("datasourceId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chart_info" ADD CONSTRAINT "FK_fac2ff11af9ae8efcbbf07177ba" FOREIGN KEY ("datasourceId") REFERENCES "datasource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chart_info" DROP CONSTRAINT "FK_fac2ff11af9ae8efcbbf07177ba"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fac2ff11af9ae8efcbbf07177b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b5a3367f0acfe4ff52a8093ad"`);
        await queryRunner.query(`DROP TABLE "chart_info"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5527742558a95839f5e521ada6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a77ec051ba40e54d6ef05143d"`);
        await queryRunner.query(`DROP TABLE "datasource"`);
    }

}
