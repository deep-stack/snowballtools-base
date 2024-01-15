import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column('varchar', { length: 255 })
    name!: string;

  @Column()
    email!: string;

  @CreateDateColumn()
    createdAt!: Date;

  @CreateDateColumn()
    updatedAt!: Date;
}
