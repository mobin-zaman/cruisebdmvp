import { Injectable } from '@nestjs/common';
import { ShipSessionService } from '../ship-session/ship-session.service';

@Injectable()
export class BookingService {
  constructor(
    private shipSessionService: ShipSessionService
  ) {
  }

  getShips() {
    return this.shipSessionService.getAllShip()
  }
}
