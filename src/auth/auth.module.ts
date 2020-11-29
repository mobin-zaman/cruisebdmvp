import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AgentService } from './agent.auth.service';
import { Agent } from './agent.entity';
import { AgentGuard } from './agent.guard';
import { AuthController } from './auth.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Agent])],
  controllers: [AuthController],
  providers: [FirebaseService, AdminService, AdminGuard, AgentService, AgentGuard],
  exports: [AdminGuard, AdminService, AgentGuard, AgentService, FirebaseService],
})
export class AuthModule {}
