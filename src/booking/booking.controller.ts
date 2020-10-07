import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { TransformInterceptor } from './interceptor';

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

  @Get('/ships/seat-category/:id')
  @UseInterceptors(TransformInterceptor)
  getSeatCategory(
    @Param('id') id
  ) {
    return this.bookingService.getSeatCategories(id);

  }
}
