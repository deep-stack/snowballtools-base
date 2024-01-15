import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { Project } from './Project';
import { Domain } from './Domain';

enum Environment {
  Production = 'Production',
  Preview = 'Preview',
  Development = 'Development',
}

enum Status {
  Building = 'Building',
  Ready = 'Ready',
  Error = 'Error',
}

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    projectID!: Project;

  @OneToOne(() => Domain)
  @JoinColumn()
    domainID!: number;

  @Column('varchar')
    branch!: string;

  @Column('varchar')
    commitHash!: string;

  @Column('varchar')
    title!: string;

  @Column({
    enum: Environment
  })
    environment!: Environment;

  @Column('boolean', { default: false })
    isCurrent!: boolean;

  @Column({
    enum: Status
  })
    status!: Status;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
