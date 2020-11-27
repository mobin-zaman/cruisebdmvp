import { Agent } from '../auth/agent.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['agencyName'])
export class Agency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  agencyName: string;

  @OneToMany(
    type => Agent,
    agent => agent.agency,
  )
  agents: Agent[];

  //TODO: add the create by admin id column
}
