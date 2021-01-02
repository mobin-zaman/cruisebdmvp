import { Routes } from 'src/ship-session/routes.entity';
import { SeatCategory } from 'src/ship-session/seat-category.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Agent } from '../auth/agent.entity';

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Agent,
    agent => agent.tickets,
  )
  agent: Agent;

  //routes
  //seatCategory

  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Routes,
    routes => routes.tickets,
  )
  route: Routes;

  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => SeatCategory,
    seatCategory => seatCategory.tickets,
  )
  seatCategory: SeatCategory;

  @Column()
  departureDate: string;

  @Column('simple-array')
  seatIds: string[];

  @Column()
  price: number;

  @Column()
  fileName: string;

  @Column()
  customerName: string;

  @Column()
  customerMobileNumber: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
