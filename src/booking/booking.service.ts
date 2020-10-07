import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipSessionService } from '../ship-session/ship-session.service';
import { GetSeatCategoryInfoDto } from './dto/get-seat-category-info.dto';

@Injectable()
export class BookingService {
  constructor(private shipSessionService: ShipSessionService) {}

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
    }
  }
}
