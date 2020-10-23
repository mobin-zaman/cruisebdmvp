import { Injectable } from '@nestjs/common';
import { ScrappingService } from './ship-srapper';
import { Routes } from './routes.entity';
import { Ship } from './ship.entity';
import { SeatCategory } from './seat-category.entity';

@Injectable()
export class ShipScrapperPuppeteer {
  async getSeatCategoryInformation(
    ship: Ship,
    route: Routes,
    departureDate: string,
  ) {
    const scrapper = await ScrappingService.build();
    try {
      await scrapper.login(ship.shipAdminPageUrl, ship.username, ship.password);

      await scrapper.fillUpRouteDepartureDateInfo(
        route.optionSelectorIdLeavingFrom,
        route.optionSelectorIdGoingTo,
        departureDate,
        route.viewSeatSelector,
      );

      return await scrapper.getAvailableSeatsAndLayOut(ship);
    } catch (e) {
      console.log('Something went wrong when pulling the strings', e);
      return { message: 'internal error' };
    } finally {
      await scrapper.browserClose();
    }
  }

  async bookSeats(
    ship: Ship,
    route: Routes,
    seatCategory: SeatCategory,
    seatIds: string[],
    departureDate: string,
  ) {
    const scrapper = await ScrappingService.build();

    try{
    await scrapper.login(ship.shipAdminPageUrl, ship.username, ship.password);

    await scrapper.fillUpRouteDepartureDateInfo(
      route.optionSelectorIdLeavingFrom,
      route.optionSelectorIdGoingTo,
      departureDate,
      route.viewSeatSelector,
    );

    await scrapper.bookSeats(seatIds, seatCategory.categoryLayOutSelector);

    } catch(e) {
      console.log("Something went wrong when booking the seats: ",e);
      throw e;
    } finally{
      await scrapper.browserClose();
    }

  }
}
