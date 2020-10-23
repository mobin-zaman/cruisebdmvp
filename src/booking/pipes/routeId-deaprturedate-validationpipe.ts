import {
  PipeTransform,
  ArgumentMetadata,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SeatCategory } from '../../ship-session/seat-category.entity';
import { GetSeatCategoryInfoDto } from '../dto/get-seat-category-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routes } from '../../ship-session/routes.entity';
// import * as _ from 'lodash';

@Injectable()
export class RouteIdDepartureDateValidationPipe implements PipeTransform {
  constructor(
    @InjectRepository(SeatCategory)
    private seatCategoryRepository: Repository<SeatCategory>,
    @InjectRepository(Routes)
    private routeRepository: Repository<Routes>,
  ) {}

  async transform(
    value: GetSeatCategoryInfoDto,
    metadata: ArgumentMetadata,
  ): Promise<any> {
    /**
     * This is a callback function to check categoryId validity
     * works with seatCategories.some()
     * also obj.id is number and value.categoryId is stirng
     * that's why the type casting needed to be performed
     * @param obj
     */

    const { routeId, departureDate } = value;

    //TODO: departure date validation needs to be added

    const route: Routes = await this.routeRepository.findOne(routeId);

    if (!route) {
      throw new NotFoundException('No such route exists');
    }

    return value;
  }
}
