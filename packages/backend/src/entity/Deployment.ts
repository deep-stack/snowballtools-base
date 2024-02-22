import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { Project } from './Project';
import { Domain } from './Domain';
import { User } from './User';
import { AppDeploymentRecordAttributes } from '../types';

export enum Environment {
  Production = 'Production',
  Preview = 'Preview',
  Development = 'Development',
}

export enum DeploymentStatus {
  Building = 'Building',
  Ready = 'Ready',
  Error = 'Error',
}

export interface ApplicationDeploymentRequest {
  type: string;
  version: string;
  name: string;
  application: string;
  config: string;
  meta: string;
}

export interface ApplicationRecord {
  type: string;
  version: string;
  name: string;
  description?: string;
  homepage?: string;
  license?: string;
  author?: string;
  repository?: string[];
  app_version?: string;
  repository_ref: string;
  app_type: string;
}

@Entity()
export class Deployment {
  // TODO: set custom generated id
  @PrimaryColumn('varchar')
    id!: string;

  @Column()
    projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column({ nullable: true })
    domainId!: string | null;

  @OneToOne(() => Domain)
  @JoinColumn({ name: 'domainId' })
    domain!: Domain | null;

  @Column('varchar')
    branch!: string;

  @Column('varchar')
    commitHash!: string;

  @Column('varchar')
    commitMessage!: string;

  @Column('varchar', { nullable: true })
    url!: string | null;

  @Column('varchar')
    applicationRecordId!: string;

  @Column('simple-json')
    applicationRecordData!: ApplicationRecord;

  @Column('varchar')
    applicationDeploymentRequestId!: string;

  @Column('simple-json')
    applicationDeploymentRequestData!: ApplicationDeploymentRequest;

  @Column('varchar', { nullable: true })
    applicationDeploymentRecordId!: string | null;

  @Column('simple-json', { nullable: true })
    applicationDeploymentRecordData!: AppDeploymentRecordAttributes | null;

  @Column({
    enum: Environment
  })
    environment!: Environment;

  @Column('boolean', { default: false })
    isCurrent!: boolean;

  @Column({
    enum: DeploymentStatus
  })
    status!: DeploymentStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
    createdBy!: User;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
