import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { Agent } from 'src/auth/agent.entity';
import { AgentGuard } from 'src/auth/agent.guard';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(@Inject(TicketService) private ticketService: TicketService) {}

  @UseGuards(AgentGuard)
  @Get('/')
  async getTicketsOfAgent(@CurrentUser() currentUser: Agent) {
    return await this.getTicketsOfAgent(currentUser);
  }

  //*TODO: cancel request post will be added
}
