import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { TransformInterceptor } from './transform.interceptor';
import { GetSeatCategoryInfoDto } from './dto/get-seat-category-info.dto';
import { RouteIdDepartureDateValidationPipe } from './pipes/routeId-deaprturedate-validationpipe';
import { BookSeatDto } from './dto/book-seat.dto';
import { AgentGuard } from 'src/auth/agent.guard';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { Agent } from 'src/auth/agent.entity';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get available ship list
   * TODO: fix the return type
   * @UseInterceptors(TransformInterceptor) is used for hiding the fields from the model
   * field hiding is achieved by the class transformer package
   */
  //TODO:
  //There should be a controller for this kind of general common endpoints
  //only checking firebase token will suffice in this cases
  @UseGuards(AgentGuard)
  @Get('/ships')
  @UseInterceptors(TransformInterceptor)
  getShips() {
    return this.bookingService.getShips();
  }

  @UseGuards(AgentGuard)
  @Get('/ships/:ships_id/seat-category/')
  @UseInterceptors(TransformInterceptor)
  getSeatCategory(@Param('ships_id') shipId) {
    return this.bookingService.getSeatCategories(shipId);
  }

  @UseGuards(AgentGuard)
  @Post('/seat-status/')
  @UsePipes(ValidationPipe) //it is added to class-transformer package to work
  @UseInterceptors(TransformInterceptor)
  getSeatCategoryInformation(
    @Body(RouteIdDepartureDateValidationPipe)
    getSeatCategoryInfoDto: GetSeatCategoryInfoDto,
  ) {
    return this.bookingService.getSeatCategoryInformation(
      getSeatCategoryInfoDto,
    );
  }

  @UseGuards(AgentGuard)
  @Post('/seat-book/')
  @UsePipes(ValidationPipe)
  async bookSeats(
    @Body() bookSeatDto: BookSeatDto,
    @CurrentUser() agent: Agent,
  ) {
    return await this.bookingService.bookSeat(bookSeatDto, agent);
  }
}
