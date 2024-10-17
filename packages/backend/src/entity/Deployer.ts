import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Deployment } from './Deployment';

@Entity()
export class Deployer {
  @PrimaryColumn()
  deployerId!: string;

  @Column()
  deployerLrn!: string;

  @Column()
  deployerApiUrl!: string;
}
