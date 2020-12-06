import { Agency } from 'src/agency/agency.entity';
import { Ticket } from 'src/ticket/ticket.entity';

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['firebase_uid'])
export class Agent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  firebase_uid: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    nullable: false,
  })
  initialPassword: string;

  @ManyToOne(
    type => Agency,
    agency => agency.agents,
  )
  agency: Agency;

  @OneToMany(
    type => Ticket,
    ticket => ticket.agent,
  )
  tickets: Promise<Ticket[]>;
}
