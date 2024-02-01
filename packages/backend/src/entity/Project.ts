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
    name!: string;

  @Column('varchar')
    repository!: string;

  @Column('varchar', { length: 255, default: 'main' })
    prodBranch!: string;

  @Column('text')
    description!: string;

  @Column('varchar')
    template!: string;

  @Column('varchar')
    framework!: string;

  @Column({
    type: 'simple-array'
  })
    webhooks!: string[];

  @Column('varchar')
    icon!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @DeleteDateColumn()
    deletedAt?: Date;

  @OneToMany(() => Deployment, (deployment) => deployment.project)
    deployments!: Deployment[];

  @OneToMany(() => ProjectMember, projectMember => projectMember.project, {
    cascade: ['soft-remove']
  })
    projectMembers!: ProjectMember[];
}
