import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipSessionService } from '../ship-session/ship-session.service';

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
      console.log("Error getting ship categories: ", e);
      throw new NotFoundException(e.message);
    }
  }
}
