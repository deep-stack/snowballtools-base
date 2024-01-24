import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';
import { ProjectMember } from './ProjectMember';
import { EnvironmentVariable } from './EnvironmentVariable';

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

  @OneToMany(() => ProjectMember, projectMember => projectMember.project)
    members!: ProjectMember[];

  @OneToMany(() => EnvironmentVariable, (environmentVariable) => environmentVariable.project)
    environmentVariables!: EnvironmentVariable[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
