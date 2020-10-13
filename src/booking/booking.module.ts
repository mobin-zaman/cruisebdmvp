import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ShipSessionModule } from '../ship-session/ship-session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from '../ship-session/ship.entity';
import { Routes } from '../ship-session/routes.entity';
import { SeatCategory } from '../ship-session/seat-category.entity';

@Module({
  imports: [
    ShipSessionModule,
    TypeOrmModule.forFeature([Ship, Routes, SeatCategory]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
