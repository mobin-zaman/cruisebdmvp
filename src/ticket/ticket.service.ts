import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'src/auth/agent.entity';
import { Routes } from 'src/ship-session/routes.entity';
import { SeatCategory } from 'src/ship-session/seat-category.entity';
import { TICKET_DIRECTORY } from '../constants';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  //FIXME: this needs to be checked properly
  async getAllTicketsAgent(currentUser: Agent) {
    return await currentUser.tickets;
  }

  async insertTicket(
    agent: Agent,
    route: Routes,
    seatCategory: SeatCategory,
    departureDate: string,
    price: number,
    seatIds: string[],
    customerName: string,
    customerMobileNumber: string,
    fileName: string,
  ) {
    const newTicket = new Ticket();

    newTicket.agent = agent;
    newTicket.route = route;
    newTicket.seatCategory = seatCategory;
    newTicket.price = price;
    newTicket.departureDate = departureDate;
    newTicket.seatIds = seatIds;
    newTicket.fileName = fileName;
    newTicket.customerName = customerName;
    newTicket.customerMobileNumber = customerMobileNumber;

    await this.ticketRepository.save(newTicket);
  }

  async getTicket(ticketId) {
    //validation is being added later, validation of whether current user owns the ticket or not

    const ticket = await this.ticketRepository.findOne(ticketId);

    const filePath = path.join(TICKET_DIRECTORY, ticket.fileName); //here file path is the name of the ticket

    //now check if file exists
    // * Ref: https://stackoverflow.com/questions/17699599/node-js-check-if-file-exists
    try {
      await fs.promises.access(filePath);
    } catch (e) {
      throw e;
    }

    return filePath;
  }
}
