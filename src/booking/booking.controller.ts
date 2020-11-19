import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { TransformInterceptor } from './transform.interceptor';
import { GetSeatCategoryInfoDto } from './dto/get-seat-category-info.dto';
import { RouteIdDepartureDateValidationPipe } from './pipes/routeId-deaprturedate-validationpipe';
import { BookSeatDto } from './dto/book-seat.dto';

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

  @Post('/seat-status/')
  @UsePipes(ValidationPipe) //it is added to class-tranformer package to work
  @UseInterceptors(TransformInterceptor)
  getSeatCategoryInformation(
    @Body(RouteIdDepartureDateValidationPipe)
    getSeatCategoryInfoDto: GetSeatCategoryInfoDto,
  ) {
    return this.bookingService.getSeatCategoryInformation(
      getSeatCategoryInfoDto,
    );
  }

  @Post('/seat-book/')
  @UsePipes(ValidationPipe)
  async bookSeats(@Body() bookSeatDto: BookSeatDto) {
    
    return await this.bookingService.bookSeat(bookSeatDto);

  }
}
