import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { Project } from './Project';

@Entity()
export class Deployer {
  @PrimaryColumn('varchar')
    deployerLrn!: string;

  @Column('varchar')
    deployerId!: string;

  @Column('varchar')
    deployerApiUrl!: string;

  @Column('varchar')
    baseDomain!: string;

  @Column('varchar', { nullable: true })
    minimumPayment!: string | null;

  @Column('varchar', { nullable: true })
    deployerAddress!: string | null;

  @ManyToMany(() => Project, (project) => project.deployers)
    projects!: Project[];
}
