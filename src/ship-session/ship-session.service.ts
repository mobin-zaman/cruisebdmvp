import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { Repository } from 'typeorm';
import { GetSeatCategoryInfoDto } from '../booking/dto/get-seat-category-info.dto';

@Injectable()
export class ShipSessionService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>,
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
    console.log('This is the seat catefory infor', getSeatCategoryInfoDto);
  }
}
