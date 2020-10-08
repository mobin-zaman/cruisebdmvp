import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  Injectable,
} from '@nestjs/common';
import { ShipSessionService } from '../../ship-session/ship-session.service';
import { SeatCategory } from '../../ship-session/seat-category.entity';
import { GetSeatCategoryInfoDto } from '../dto/get-seat-category-info.dto';
import { Routes } from '../../ship-session/routes.entity';

@Injectable()
export class ShipIdCategoryIdValidationPipe implements PipeTransform {
  constructor(private shipService: ShipSessionService) {}

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
    console.log('value: ', value);
    const checkCategoryId = obj => {
      return obj.id.toString() === value.categoryId;
    };

    const checkRouteId = obj => {
      return obj.id.toString() === value.routeId;
    };

    try {
      const seatCategories: SeatCategory[] = await this.shipService.getSeatCategories(
        value.shipId,
      );

      if (!seatCategories.some(checkCategoryId)) {
        throw new BadRequestException(
          `There is no seat category for ${value.categoryId} on this ship`,
        );
      }

      const routes: Routes[] = await this.shipService.getRoutes(value.shipId);

      if (!routes.some(checkRouteId)) {
        throw new BadRequestException(
          `There is no route for ${value.routeId} on this ship`,
        );
      }
    } catch (e) {
      console.log('Error validating seat categories: ', e);
      if (e.message === 'Ship not found')
        throw new BadRequestException(
          `There is no ship with id: ${value.shipId}`,
        );
      else throw e;
    }

    return value;
  }
}
