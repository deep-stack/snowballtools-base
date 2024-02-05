import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { Project } from './Project';
import { Domain } from './Domain';
import { User } from './User';

export enum Environment {
  Production = 'Production',
  Preview = 'Preview',
  Development = 'Development',
}

enum Status {
  Building = 'Building',
  Ready = 'Ready',
  Error = 'Error',
}

@Entity()
export class Deployment {
  // TODO: set custom generated id
  @PrimaryColumn('varchar')
    id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @OneToOne(() => Domain)
  @JoinColumn({ name: 'domainId' })
    domain!: Domain | null;

  @Column('varchar')
    branch!: string;

  @Column('varchar')
    commitHash!: string;

  @Column('varchar')
    title!: string;

  @Column('varchar')
    url!: string;

  @Column({
    enum: Environment
  })
    environment!: Environment;

  @Column('boolean', { default: false })
    isCurrent!: boolean;

  @Column({
    enum: Status
  })
    status!: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
    createdBy!: User;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
