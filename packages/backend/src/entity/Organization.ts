import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique
} from 'typeorm';
import { UserOrganization } from './UserOrganization';

@Entity()
@Unique(['slug'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column('varchar', { length: 255 })
    name!: string;

  @Column('varchar')
    slug!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.organization,
    {
      cascade: ['soft-remove']
    }
  )
    userOrganizations!: UserOrganization[];
}
