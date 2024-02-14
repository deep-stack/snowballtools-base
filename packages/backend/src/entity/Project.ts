import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';
import { ProjectMember } from './ProjectMember';
import { Deployment } from './Deployment';

export interface ApplicationDeploymentRequest {
  type: string
  version: string
  name: string
  application: string
  config: string,
  meta: string
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
    owner!: User;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
    organization!: Organization | null;

  @Column('varchar')
    organizationId!: string;

  @Column('varchar')
    name!: string;

  @Column('varchar')
    repository!: string;

  @Column('varchar', { length: 255, default: 'main' })
    prodBranch!: string;

  @Column('varchar', { nullable: true })
    registryRecordId!: string | null;

  @Column('simple-json', { nullable: true })
    registryRecordData!: ApplicationDeploymentRequest | null;

  @Column('text', { default: '' })
    description!: string;

  // TODO: Compute template & framework in import repository
  @Column('varchar', { nullable: true })
    template!: string | null;

  @Column('varchar', { nullable: true })
    framework!: string | null;

  @Column({
    type: 'simple-array'
  })
    webhooks!: string[];

  @Column('varchar')
    icon!: string;

  @Column('varchar')
    subDomain!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @DeleteDateColumn()
    deletedAt!: Date | null;

  @OneToMany(() => Deployment, (deployment) => deployment.project)
    deployments!: Deployment[];

  @OneToMany(() => ProjectMember, projectMember => projectMember.project, {
    cascade: ['soft-remove']
  })
    projectMembers!: ProjectMember[];
}
