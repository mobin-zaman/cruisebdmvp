import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  Injectable,
} from '@nestjs/common';
import { SeatCategory } from '../../ship-session/seat-category.entity';
import { GetSeatCategoryInfoDto } from '../dto/get-seat-category-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routes } from '../../ship-session/routes.entity';
import _ from 'lodash';

@Injectable()
export class RouteIdCategoryIdDepartureDateValidationPipe
  implements PipeTransform {
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

    const { seatCategoryId, routeId, departureDate } = value;

    const seatCategory: SeatCategory = await this.seatCategoryRepository.findOne(
      seatCategoryId,
    );
    const route: Routes = await this.routeRepository.findOne(routeId);

    const shipFromSeatCategory = await seatCategory.ship;
    const shipFromRoute = await route.ship;

    const isShipSame: boolean = _.isEqual(shipFromRoute, shipFromSeatCategory);

    if (!isShipSame) {
      throw new BadRequestException(
        `seatCategoryId: ${seatCategory.id} and routeId: ${route.id} combination is not valid`,
      );
    }

    return value;
  }
}
