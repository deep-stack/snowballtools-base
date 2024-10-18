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
import { Deployer } from './Deployer';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
    owner!: User;

  @Column({ nullable: false })
    ownerId!: string;

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

  @Column('text', { default: '' })
    description!: string;

  @Column('varchar', { nullable: true })
    auctionId!: string | null;

  @OneToMany(() => Deployer, (deployer) => deployer.deployerId)
    deployers!: Deployer[];

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

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @DeleteDateColumn()
    deletedAt!: Date | null;

  @OneToMany(() => Deployment, (deployment) => deployment.project)
    deployments!: Deployment[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.project, {
    cascade: ['soft-remove']
  })
    projectMembers!: ProjectMember[];
}
