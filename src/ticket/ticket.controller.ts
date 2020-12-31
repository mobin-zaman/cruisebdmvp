import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Agent } from 'src/auth/agent.entity';
import { AgentGuard } from 'src/auth/agent.guard';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { TicketService } from './ticket.service';
import * as fs from 'fs';

@Controller('ticket')
export class TicketController {
  constructor(@Inject(TicketService) private ticketService: TicketService) {}

  @UseGuards(AgentGuard)
  @Get('/')
  async getTicketsOfAgent(@CurrentUser() currentUser: Agent) {
    return await this.getTicketsOfAgent(currentUser);
  }

  //* reference: https://stackoverflow.com/questions/62797984/how-to-download-pdf-from-puppeteer-using-nest-js-as-server-side-and-react-in-cli
  @Get('/:ticketId/pdf')
  async getTicket(@Res() res: Response, @Param('ticketId') ticketId: number) {
    try {
      //TODO: validation needs to be added here

      const filePath = await this.ticketService.getTicket(ticketId);

      const buffer = fs.readFileSync(filePath);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=ticket.pdf',
        'Content-Length': buffer.length,

        // prevent cache
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
      });

      res.end(buffer);
    } catch (e) {
      console.log("Get Ticket error: ", e);
      throw new NotFoundException('ticket not found');
    }
  }
}
