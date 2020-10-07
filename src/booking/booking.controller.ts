import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { TransformInterceptor } from './interceptor';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get available ship list
   * TODO: fix the return type
   */
  @Get('/ships')
  @UseInterceptors(TransformInterceptor)
  getShips() {
    return this.bookingService.getShips();
  }

  @Get('/ships/seat-category/:id')
  getSeatCategory() {
    return null;
  }
}
