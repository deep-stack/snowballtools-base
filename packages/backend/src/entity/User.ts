import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { ProjectMember } from './ProjectMember';

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

  @OneToMany(() => ProjectMember, projectMember => projectMember.project)
    projectMembers!: ProjectMember[];
}
