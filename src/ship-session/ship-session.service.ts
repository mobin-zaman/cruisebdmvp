import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ShipSessionService {
  constructor(
    @InjectRepository(Ship)
    private shipRepository: Repository<Ship>
  ) {}

  getAllShip():Promise<Ship[]>  {
    return this.shipRepository.find();
  }
}