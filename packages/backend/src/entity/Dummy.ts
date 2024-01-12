import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
// TODO: Add proper indices
export class Dummy {
  @PrimaryGeneratedColumn()
    id!: number;

  // TODO: Specify db type and column options
  @Column()
    firstName!: string;

  @Column()
    lastName!: string;

  @Column()
    age!: number;
}
