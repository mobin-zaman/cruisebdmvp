import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ShipSessionModule } from '../ship-session/ship-session.module';

@Module({
  imports: [ShipSessionModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
