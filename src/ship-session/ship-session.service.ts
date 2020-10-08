import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { Repository } from 'typeorm';
import { GetSeatCategoryInfoDto } from '../booking/dto/get-seat-category-info.dto';
import { SeatCategory } from './seat-category.entity';
import { ScrappingService } from './ship-srapper';

@Injectable()
export class ShipSessionService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
    @InjectRepository(SeatCategory)
    private seatCategoryRepository: Repository<SeatCategory>,
  ) {}

  getAllShip(): Promise<Ship[]> {
    return this.shipRepository.find();
  }

  async getSeatCategories(id) {
    const ships: Ship = await this.shipRepository.findOne(id);

    if (!ships) throw Error('Ship not found');

    return await ships.seatCategories;
  }

  async getSeatCategoryInformation(
    getSeatCategoryInfoDto: GetSeatCategoryInfoDto,
  ) {
    const { categoryId } = await getSeatCategoryInfoDto;

    const category = await this.seatCategoryRepository.findOne(categoryId);
    const ship = await category.ship;
    console.log('this is the category: ', category);

    const scrapper = await ScrappingService.build();
    await scrapper.login(ship.shipAdminPageUrl, ship.username, ship.password);
  }
}
