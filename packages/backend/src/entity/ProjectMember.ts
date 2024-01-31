import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';

import { Project } from './Project';
import { User } from './User';

export enum Permission {
  View = 'View',
  Edit = 'Edit'
}

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, (user) => user.projectMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    member!: User;

  @ManyToOne(() => Project, (project) => project.projectMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column({
    type: 'simple-array'
  })
    permissions!: Permission[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
