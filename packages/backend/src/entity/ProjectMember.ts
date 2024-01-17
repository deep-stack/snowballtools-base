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

enum Permissions {
  View = 'View',
  Edit = 'Edit'
}

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    member!: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column({
    enum: Permissions,
    type: 'simple-array'
  })
    permissions!: Permissions[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
