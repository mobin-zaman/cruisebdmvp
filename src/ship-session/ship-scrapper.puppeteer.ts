import { Injectable } from '@nestjs/common';
import { ScrappingService } from './ship-srapper';
import { SeatCategory } from './seat-category.entity';
import { Ship } from './ship.entity';

@Injectable()
export class ShipScrapperPuppeteer {
  async getSeatCategoryInformation(ship: Ship, seatCategory: SeatCategory) {
    const scrapper = await ScrappingService.build();

    await scrapper.login(ship.shipAdminPageUrl, ship.username, ship.password);
  }
}
