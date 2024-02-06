import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  DeleteDateColumn
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
    member!: User;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
    organization!: Organization;

  @Column({
    enum: Role
  })
    role!: Role;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @DeleteDateColumn()
    deletedAt!: Date | null;
}
