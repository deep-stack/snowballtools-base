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
  Owner = 'Owner',
  Maintainer = 'Maintainer',
  Reader = 'Reader',
}

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userID' })
    user!: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectID' })
    project!: Project;

  @Column({
    enum: Permissions
  })
    role!: Permissions;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
