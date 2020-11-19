import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { Repository } from 'typeorm';
import { GetSeatCategoryInfoDto } from '../booking/dto/get-seat-category-info.dto';
import { SeatCategory } from './seat-category.entity';
import { ShipScrapperPuppeteer } from './ship-scrapper.puppeteer';
import { Routes } from './routes.entity';
import { BookSeatDto } from 'src/booking/dto/book-seat.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ShipSessionService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
    @InjectRepository(SeatCategory)
    private seatCategoryRepository: Repository<SeatCategory>,
    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
    private shipScrapperPuppeteer: ShipScrapperPuppeteer,
  ) {}

  getAllShip(): Promise<Ship[]> {
    return this.shipRepository.find();
  }

  async getSeatCategories(id) {
    const ships: Ship = await this.shipRepository.findOne(id);

    if (!ships) throw Error('Ship not found');

    return await ships.seatCategories;
  }

  async getRoutes(id) {
    const ship: Ship = await this.shipRepository.findOne(id);
    if (!ship) throw Error('Ship not found');

    return ship.routes;
  }

  async getSeatCategoryInformation(
    getSeatCategoryInfoDto: GetSeatCategoryInfoDto,
  ) {
    const { routeId, departureDate } = await getSeatCategoryInfoDto;

    const route: Routes = await this.routesRepository.findOne(routeId);

    const ship: Ship = await route.ship;

    return await this.shipScrapperPuppeteer.getSeatCategoryInformation(
      ship,
      route,
      departureDate,
    );
  }

  async bookSeats(bookSeatDto: BookSeatDto) {
    const {
      routeId,
      seatCategoryId,
      seatIds,
      departureDate,
      customerName,
      mobileNumber,
    } = bookSeatDto;

    const route: Routes = await this.routesRepository.findOne(routeId);

    const seatCategory: SeatCategory = await this.seatCategoryRepository.findOne(
      seatCategoryId,
    );

    const ship: Ship = await route.ship;

    const result = await this.shipScrapperPuppeteer.bookSeats(
      ship,
      route,
      seatCategory,
      seatIds,
      departureDate,
      customerName,
      mobileNumber,
    );

    const { ticketPath } = result;

    const buffer = fs.readFileSync(ticketPath);

    return buffer;
  }

 
  async getTicket(ticketName: string) {



    const TICKET_DIR = path.join(process.cwd(), 'tickets');

    const filePath = path.join(TICKET_DIR, ticketName);

    //now check if file exists
    try{
      await fs.promises.access(filePath);
    } catch(e) {
      throw e;
    }

    return filePath;
  }
}
