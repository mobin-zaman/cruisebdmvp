import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipSessionModule } from './ship-session/ship-session.module';
import { Ship } from './ship-session/ship.entity';
import { Routes } from './ship-session/routes.entity';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { SeatCategory } from './ship-session/seat-category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASS'),
        database: configService.get('DATABASE_NAME'),
        entities: [Ship, Routes, SeatCategory],
        synchronize: true,
      }),
    }),
    ShipSessionModule,
    AuthModule,
    BookingModule,
  ],
})
export class AppModule {}
