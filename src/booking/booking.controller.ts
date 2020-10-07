import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { TransformInterceptor } from './transform.interceptor';

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
  getSeatCategory(
    @Param('ships_id') shipId
  ) {
    return this.bookingService.getSeatCategories(shipId);
  }


}
