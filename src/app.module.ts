import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from 'nestjs-firebase';



import { ShipSessionModule } from './ship-session/ship-session.module';
import { Ship } from './ship-session/ship.entity';
import { Routes } from './ship-session/routes.entity';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { SeatCategory } from './ship-session/seat-category.entity';
import * as path from 'path';
import { Admin } from './auth/admin.entity';
import { AgencyModule } from './agency/agency.module';
import { Agency } from './agency/agency.entity';
import { Agent } from './auth/agent.entity';

const firebaseConfigJsonPath: string = path.join(
  process.cwd(),
  'config/cruisebd-82430-firebase-adminsdk-n95ny-5fa423dba7.json'
);
@Module({
  imports: [

    //config module is for reading .env properties
    ConfigModule.forRoot({ isGlobal: true }),

    //TODO: reference for the below instantiation needs to be added
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
        entities: [Ship, Routes, SeatCategory, Admin, Agent, Agency],
        synchronize: true,
      }),
    }),

    FirebaseModule.forRoot({
      googleApplicationCredential: firebaseConfigJsonPath,
    }),

    ShipSessionModule,
    AuthModule,
    BookingModule,
    AgencyModule,
  ],
})
export class AppModule {}
