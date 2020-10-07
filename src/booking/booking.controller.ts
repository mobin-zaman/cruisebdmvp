import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get available ship list
   * TODO: fix the return type
   */
  @Get('/ships')
  getShips() {
    return this.bookingService.getShips();
  }

  @Get('/ships/seat-category/:id')
  getSeatCategory() {
    return null;
  }

}
