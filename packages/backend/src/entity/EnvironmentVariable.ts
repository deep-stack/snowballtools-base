import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class EnvironmentVariable {
  @PrimaryGeneratedColumn()
    id!: number;

  // TODO: use foreign key project
  @Column('int')
    projectId!: number;

  @Column({
    type: 'simple-array',
    default: []
  })
    environments!: string[];

  @Column('varchar')
    key!: string;

  @Column('varchar')
    value!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
