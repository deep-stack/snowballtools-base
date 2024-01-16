import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerID' })
    owner!: User;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organizationID' })
    organization!: Organization | null;

  @Column('varchar')
    name!: string;

  @Column('varchar')
    repository!: string;

  @Column('varchar', { length: 255, default: 'main' })
    prodBranch!: string;

  @Column('text')
    description!: string;

  @Column('varchar')
    template!: string;

  @Column('varchar')
    framework!: string;

  @Column({
    type: 'simple-array'
  })
    webhooks!: string[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
