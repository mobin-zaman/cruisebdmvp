import {
  PipeTransform,
  BadRequestException,
  Type,
  ArgumentMetadata,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ShipSessionService } from '../../ship-session/ship-session.service';
import { SeatCategory } from '../../ship-session/seat-category.entity';
import { GetSeatCategoryInfoDto } from '../dto/get-seat-category-info.dto';

@Injectable()
export class ShipIdCategoryIdValidationPipe implements PipeTransform {

  constructor(private shipService: ShipSessionService) {}


  async transform(value: GetSeatCategoryInfoDto, metadata: ArgumentMetadata): Promise<any> {
    console.log('getting the value: ', value);

    try {
      const seatCategories: SeatCategory[] =await this.shipService.getSeatCategories(value.shipId);
      console.log(seatCategories);
    } catch(e) {
      throw new BadRequestException(`There is no ship with id: ${value.shipId}`)
    }

    return value;
  }
}
