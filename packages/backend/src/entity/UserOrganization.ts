import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';

enum Role {
  Owner = 'Owner',
  Maintainer = 'Maintainer',
  Reader = 'Reader'
}

@Entity()
export class UserOrganization {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user!: User;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    organization!: Organization;

  @Column({
    enum: Role
  })
    role!: Role;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
