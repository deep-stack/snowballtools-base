import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { UserOrganization } from './UserOrganization';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column('varchar', { length: 255 })
    name!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization, {
    cascade: ['soft-remove']
  })
    userOrganizations!: UserOrganization[];
}
