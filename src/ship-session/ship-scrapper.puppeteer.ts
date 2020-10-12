import { Injectable } from '@nestjs/common';
import { ScrappingService } from './ship-srapper';
import { SeatCategory } from './seat-category.entity';
import { Ship } from './ship.entity';
import { Routes } from './routes.entity';

@Injectable()
export class ShipScrapperPuppeteer {
  async getSeatCategoryInformation(
    ship: Ship,
    seatCategory: SeatCategory,
    routes: Routes,
    departureDate: string,
  ) {
    const scrapper = await ScrappingService.build();

    await scrapper.login(ship.shipAdminPageUrl, ship.username, ship.password);

    await scrapper.fillUpRouteDepartureDateInfo(
      routes.optionSelectorIdLeavingFrom,
      routes.optionSelectorIdGoingTo,
      departureDate,
      routes.viewSeatSelector,
    );
  }
}
