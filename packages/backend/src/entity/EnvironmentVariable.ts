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

enum Environment {
  Production = 'Production',
  Preview = 'Preview',
  Development = 'Development',
}

@Entity()
export class EnvironmentVariable {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column({
    enum: Environment
  })
    environment!: Environment;

  @Column('varchar')
    key!: string;

  @Column('varchar')
    value!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
