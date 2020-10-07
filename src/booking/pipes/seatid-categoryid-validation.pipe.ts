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

    /**
     * This is a callback function to check categoruId validity
     * works with seatCategories.some()
     * @param obj
     */
    const checkCategoryId = obj => {
      return obj.id === value.categoryId;
    }

    try {
      const seatCategories: SeatCategory[] =await this.shipService.getSeatCategories(value.shipId);

      console.log(seatCategories.some(checkCategoryId))
      if(!seatCategories.some(checkCategoryId)){
        console.log("matched id: ",value.categoryId) ;
        throw new BadRequestException(`There is no seat category for ${value.categoryId} on this ship`);
      }
    } catch(e) {
      // console.log("Error validating seat categories: ",e);
      if(e.message === "Ship not found") throw new BadRequestException(`There is no ship with id: ${value.shipId}`)
      else throw e;
    }

    return value;
  }
}
