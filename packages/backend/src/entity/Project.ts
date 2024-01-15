import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  // TODO: use foreign key user
  @Column('int')
    ownerID!: number;

  // TODO: use foreign key organization
  @Column('int', {
    nullable: true
  })
    organizationID!: number | null;

  @Column('varchar')
    name!: string;

  @Column('varchar')
    repository!: string;

  @Column('varchar', { length: 42, default: 'main' })
    prodBranch!: string;

  @Column('text')
    description!: string;

  @Column('varchar')
    template!: string;

  @Column('varchar')
    framework!: string;

  @Column({
    type: 'simple-array',
    default: []
  })
    webhooks!: string[];

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
