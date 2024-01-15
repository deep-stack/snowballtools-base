import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

enum Status {
  Live = 'Live',
  Pending = 'Pending',
}

@Entity()
export class Domain {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column('varchar', { length: 255, default: 'main' })
    branch!: string;

  @Column('varchar', { length: 255 })
    name!: string;

  @Column('boolean', { default: false })
    isRedirected!: boolean;

  @Column({
    enum: Status
  })
    status!: Status;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
