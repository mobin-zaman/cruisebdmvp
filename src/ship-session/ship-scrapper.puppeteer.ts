import { Injectable } from '@nestjs/common';
import { ScrappingService } from './ship-srapper';
import { SeatCategory } from './seat-category.entity';
import { Ship } from './ship.entity';
import { Routes } from './routes.entity';

@Injectable()
export class ShipScrapperPuppeteer {
  async getSeatCategoryInformation(route: Routes, departureDate: string) {
    const scrapper = await ScrappingService.build();

    const ship = await route.ship;

    await scrapper.login(ship.shipAdminPageUrl, ship.username, ship.password);

    await scrapper.fillUpRouteDepartureDateInfo(
      route.optionSelectorIdLeavingFrom,
      route.optionSelectorIdGoingTo,
      departureDate,
      route.viewSeatSelector,
    );

    await scrapper.getAvailableSeatsAndLayOut(ship);
  }
}
