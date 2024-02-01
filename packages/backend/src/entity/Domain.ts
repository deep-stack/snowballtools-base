import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn
} from 'typeorm';

import { Project } from './Project';

export enum Status {
  Live = 'Live',
  Pending = 'Pending',
}

@Entity()
export class Domain {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column('varchar')
    projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column('varchar', { length: 255, default: 'main' })
    branch!: string;

  @Column('varchar', { length: 255 })
    name!: string;

  @Column('int', { nullable: true })
    redirectToId!: number;

  @ManyToOne(() => Domain)
  @JoinColumn({ name: 'redirectToId' })
    // eslint-disable-next-line no-use-before-define
    redirectTo!: Domain | null;

  @Column({
    enum: Status,
    default: Status.Pending
  })
    status!: Status;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  @DeleteDateColumn()
    deletedAt?: Date;
}
