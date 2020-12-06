import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'src/auth/agent.entity';
import { Routes } from 'src/ship-session/routes.entity';
import { SeatCategory } from 'src/ship-session/seat-category.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async getAllTicketsAgent(currentUser: Agent) {
    return await currentUser.tickets;
  }

  async insertTicket(
    agent: Agent,
    route: Routes,
    seatCategory: SeatCategory,
    price: number,
    seatIds: [string],
  ) {
    const newTicket = new Ticket();

    newTicket.agent = agent;
    newTicket.route = route;
    newTicket.seatCategory = seatCategory;
    newTicket.price = price;
    newTicket.seatIds = seatIds;

    await this.ticketRepository.save(newTicket);
  }
}
