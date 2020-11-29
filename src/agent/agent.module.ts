import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../auth/agent.entity';
import { Agency } from 'src/agency/agency.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Agent, Agency])],
  providers: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
