import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { TransformInterceptor } from './transform.interceptor';
import { GetSeatCategoryInfoDto } from './dto/get-seat-category-info.dto';
import { ShipIdCategoryIdValidationPipe } from './pipes/seatid-categoryid-validation.pipe';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get available ship list
   * TODO: fix the return type
   * @UseInterceptors(TransformInterceptor) is used for hiding the fields from the model
   * field hiding is achieved by the class transformer package
   */
  @Get('/ships')
  @UseInterceptors(TransformInterceptor)
  getShips() {
    return this.bookingService.getShips();
  }

  @Get('/ships/:ships_id/seat-category/')
  @UseInterceptors(TransformInterceptor)
  getSeatCategory(@Param('ships_id') shipId) {
    return this.bookingService.getSeatCategories(shipId);
  }

  @Get('/ships/:shipId/seat_category/:categoryId')
  @UseInterceptors(TransformInterceptor)
  getSeatCategoryInformation(
    @Param(ShipIdCategoryIdValidationPipe)
    getSeatCategoryInfoDto: GetSeatCategoryInfoDto,
  ) {
    return this.bookingService.getSeatCategoryInformation(
      getSeatCategoryInfoDto,
    );
  }
}
