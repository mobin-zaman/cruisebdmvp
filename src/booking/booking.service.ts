import { Injectable } from '@nestjs/common';
import { ShipSessionService } from '../ship-session/ship-session.service';

@Injectable()
export class BookingService {
  constructor(private shipSessionService: ShipSessionService) {}

  async getShips() {
    return this.shipSessionService.getAllShip();
  }

  async getShipCategory() {

  }
}
