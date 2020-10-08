import { Module } from '@nestjs/common';
import { ShipSessionService } from './ship-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { SeatCategory } from './seat-category.entity';

/**
 * This module is going to be responsible for
 * 1. Holding the ship database models
 * 2.Running the scraping session
 */
@Module({
  imports: [TypeOrmModule.forFeature([Ship, SeatCategory])],
  providers: [ShipSessionService],
  exports: [ShipSessionService],
})
export class ShipSessionModule {}
