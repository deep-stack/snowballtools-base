import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
  DeleteDateColumn
} from 'typeorm';

import { Project } from './Project';
import { User } from './User';

export enum Permission {
  View = 'View',
  Edit = 'Edit'
}

@Entity()
@Unique(['project', 'member'])
export class ProjectMember {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, (user) => user.projectMembers)
  @JoinColumn({ name: 'userId' })
    member!: User;

  @ManyToOne(() => Project, (project) => project.projectMembers)
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column({
    type: 'simple-array'
  })
    permissions!: Permission[];

  @Column('boolean', { default: false })
    isPending!: boolean;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @DeleteDateColumn()
    deletedAt?: Date;
}
