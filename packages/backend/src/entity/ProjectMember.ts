import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Project } from './Project';
import { User } from './User';

enum Permissions {
  Owner = 'Owner',
  Maintainer = 'Maintainer',
  Reader = 'Reader'
}

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
    userID!: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    projectID!: Project;

  @Column({
    enum: Permissions
  })
    role!: Permissions;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
