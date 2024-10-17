import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Deployer {
  @PrimaryColumn()
  deployerId!: string;

  @Column()
  deployerLrn!: string;

  @Column()
  deployerApiUrl!: string;
}
