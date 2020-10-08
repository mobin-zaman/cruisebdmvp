import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  Injectable,
} from '@nestjs/common';
import { ShipSessionService } from '../../ship-session/ship-session.service';
import { SeatCategory } from '../../ship-session/seat-category.entity';
import { GetSeatCategoryInfoDto } from '../dto/get-seat-category-info.dto';

@Injectable()
export class ShipIdCategoryIdValidationPipe implements PipeTransform {
  constructor(private shipService: ShipSessionService) {}

  async transform(
    value: GetSeatCategoryInfoDto,
    metadata: ArgumentMetadata,
  ): Promise<any> {
    console.log('getting the value: ', value);

    /**
     * This is a callback function to check categoryId validity
     * works with seatCategories.some()
     * also obj.id is number and value.categoryId is stirng
     * that's why the type casting needed to be performed
     * @param obj
     */
    const checkCategoryId = obj => {
      return obj.id.toString() === value.categoryId;
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
