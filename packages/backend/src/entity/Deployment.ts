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

export interface ApplicationRecord {
  type: string;
  version:string
  name?: string
  description?: string
  homepage?: string
  license?: string
  author?: string
  repository?: string[],
  app_version?: string
  repository_ref: string
  app_type: string
}

@Entity()
export class Deployment {
  // TODO: set custom generated id
  @PrimaryColumn('varchar')
    id!: string;

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

  @Column('varchar')
    url!: string;

  @Column('varchar')
    registryRecordId!: string;

  @Column('simple-json')
    registryRecordData!: ApplicationRecord;

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
