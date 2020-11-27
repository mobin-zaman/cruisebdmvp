import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AuthController } from './auth.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin])
  ],
  controllers: [AuthController],
  providers: [FirebaseService,]
})
export class AuthModule {}
