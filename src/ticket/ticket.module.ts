import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports:[AuthModule],
  providers: [ TicketService],
  controllers: [TicketController]
})
export class TicketModule {}
