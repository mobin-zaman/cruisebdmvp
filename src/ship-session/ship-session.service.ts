import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { Repository } from 'typeorm';
import { GetSeatCategoryInfoDto } from '../booking/dto/get-seat-category-info.dto';
import { SeatCategory } from './seat-category.entity';
import { ShipScrapperPuppeteer } from './ship-scrapper.puppeteer';
import { Routes } from './routes.entity';

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
    const { categoryId, routeId , departureDate} = await getSeatCategoryInfoDto;

    const category:SeatCategory = await this.seatCategoryRepository.findOne(categoryId);
    const ship = await category.ship;
    console.log('this is the category: ', category);

    const route: Routes = await this.routesRepository.findOne(routeId);

    await this.shipScrapperPuppeteer.getSeatCategoryInformation(ship, category, route,departureDate);
  }
}
