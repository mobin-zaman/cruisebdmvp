import { Injectable } from '@nestjs/common';
import { ShipSessionService } from '../ship-session/ship-session.service';

@Injectable()
export class BookingService {
  constructor(
    private shipSessionService: ShipSessionService
  ) {
  }

  async getShips() {
    const ships = await this.shipSessionService.getAllShip();
    console.log("ships username: ", ships[0].username);
    return ships;
    // return this.shipSessionService.getAllShip()

  }
}
