import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Deployer {
  @PrimaryColumn('varchar')
    deployerId!: string;

  @Column('varchar')
    deployerLrn!: string;

  @Column('varchar')
    deployerApiUrl!: string;

  @Column('varchar')
    baseDomain!: string;
}
