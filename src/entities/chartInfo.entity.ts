import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Datasource } from './datasource.entity';

@Entity()
@Index(['datasourceId'])
@Index(['userId'])
export class ChartInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  chartName: string;

  @ManyToOne(() => Datasource)
  @JoinColumn({ name: 'datasourceId' })
  datasource: Datasource;

  @Column()
  datasourceId: string;

  @Column()
  chartType: string;

  @Column()
  xAxis: string;

  @Column()
  yAxis: string;

  @Column()
  prompt: string;

  @Column('text')
  queryData: string;

  @Column('text')
  chartData: string;

  @Column()
  sql: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
