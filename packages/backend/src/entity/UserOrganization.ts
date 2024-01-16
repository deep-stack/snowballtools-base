import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';

enum Role {
  Owner = 'Owner',
  Maintainer = 'Maintainer',
  Reader = 'Reader',
}

@Entity()
export class UserOrganization {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userID' })
    user!: User;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationID' })
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
