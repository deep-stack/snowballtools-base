import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
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

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
    project!: Project;

  @Column('varchar', { length: 255, default: 'main' })
    branch!: string;

  @Column('varchar', { length: 255 })
    name!: string;

  @Column('boolean', { default: false })
    isRedirected!: boolean;

  @Column({
    enum: Status,
    default: Status.Pending
  })
    status!: Status;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
