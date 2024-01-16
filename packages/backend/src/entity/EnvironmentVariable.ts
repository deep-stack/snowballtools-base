import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Project } from './Project';

@Entity()
export class EnvironmentVariable {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column({
    type: 'simple-array'
  })
    environments!: string[];

  @Column('varchar')
    key!: string;

  @Column('varchar')
    value!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
