import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import {InjectRepository} from "@nestjs/typeorm";
import { Agent } from 'src/auth/agent.entity';

@Injectable()
export class TicketService {
    constructor(
       @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    ) {}

    async getAllTicketsAgent(currentUser:Agent) {
        return await currentUser.tickets;
    }
}
