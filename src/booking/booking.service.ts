import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Agent } from 'src/auth/agent.entity';
import { ShipSessionService } from '../ship-session/ship-session.service';
import { BookSeatDto } from './dto/book-seat.dto';
import { GetSeatCategoryInfoDto } from './dto/get-seat-category-info.dto';

@Injectable()
export class BookingService {
  constructor(
    private shipSessionService: ShipSessionService,
  ) {}

  async getShips() {
    return this.shipSessionService.getAllShip();
  }

  async getSeatCategories(id: number) {
    try {
      return await this.shipSessionService.getSeatCategories(id);
    } catch (e) {
      console.log('Error getting ship categories: ', e);
      throw new NotFoundException(e.message);
    }
  }

  async getSeatCategoryInformation(
    getSeatCategoryInfoDto: GetSeatCategoryInfoDto,
  ) {
    try {
      return await this.shipSessionService.getSeatCategoryInformation(
        getSeatCategoryInfoDto,
      );
    } catch (e) {
      console.log('Error getting ship category information: ', e);
      throw new BadRequestException(
        'Error getting seat category information',
        e.message,
      );
    }
  }

  async bookSeat(bookSeatDto: BookSeatDto, agent: Agent){
    try {
      return await this.shipSessionService.bookSeats(bookSeatDto, agent);
    } catch (e) {
      console.log('Error booking seat: ', e);
      throw new BadRequestException('Error booking seats', e.message);
    }
  }

  async getTicket(ticketName) {
    try {
      return await this.shipSessionService.getTicket(ticketName);
    } catch (e) {
      console.log('Error getting tickets: ', e);
      throw new BadRequestException('Error getting tickets: ', e);
    }
  }
}
