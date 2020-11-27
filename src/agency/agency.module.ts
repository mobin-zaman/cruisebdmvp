import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './agency.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agency]),
    AuthModule
  ],
  providers: [AgencyService],
  controllers: [AgencyController]
})
export class AgencyModule {}
