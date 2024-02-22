import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique
} from 'typeorm';

import { ProjectMember } from './ProjectMember';
import { UserOrganization } from './UserOrganization';

@Entity()
@Unique(['email'])
@Unique(['ethAddress'])
export class User {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  // TODO: Set ethAddress as ID
  @Column()
    ethAddress!: string;

  @Column('varchar', { length: 255, nullable: true })
    name!: string | null;

  @Column()
    email!: string;

  @Column('varchar', { nullable: true })
    gitHubToken!: string | null;

  @Column('boolean', { default: false })
    isVerified!: boolean;

  @CreateDateColumn()
    createdAt!: Date;

  @CreateDateColumn()
    updatedAt!: Date;

  @OneToMany(() => ProjectMember, projectMember => projectMember.project, {
    cascade: ['soft-remove']
  })
    projectMembers!: ProjectMember[];

  @OneToMany(() => UserOrganization, UserOrganization => UserOrganization.member, {
    cascade: ['soft-remove']
  })
    userOrganizations!: UserOrganization[];
}
