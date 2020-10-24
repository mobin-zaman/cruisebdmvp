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
    customerName: string,
    mobileNumber:string
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

      const ticketUrl = await scrapper.bookSeats(
        seatIds,
        seatCategory.categoryButtonSelector,
        seatCategory.categoryLayOutSelector,
        route.boardingPointSelector,
        route.boardingPointOption,
        route.droppingPointSelector,
        route.droppingPointOption,
        route.customerNameSelector,
        customerName,
        route.mobileNumberSelector,
        mobileNumber,
        route.purchaseButtonSelector
      );

      return ticketUrl;
    } catch (e) {
      console.log('Something went wrong when booking the seats: ', e);
      throw e;
    }
    // ! TODO: add it
     finally{
      await scrapper.browserClose();
    }
  }
}
