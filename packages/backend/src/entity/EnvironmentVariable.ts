import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { Project } from './Project';

@Entity()
export class EnvironmentVariable {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    projectId!: string;

  // TODO: Figure out to use array
  // @Column({
  //   type: 'simple-array',
  //   default: []
  // })
  //   environments!: string[];

  @Column('varchar')
    key!: string;

  @Column('varchar')
    value!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
