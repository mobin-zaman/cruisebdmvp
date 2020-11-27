import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AuthController],
  providers: [FirebaseService, AdminService, AdminGuard],
  exports: [AdminGuard, AdminService],
})
export class AuthModule {}
