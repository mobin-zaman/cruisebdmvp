import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'http';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private agentRepository: Repository<Agent>,
  ) {}

  public async createAgent(createAgentDto: CreateAgentDto) {
    const { name, email, phoneNumber, agencyId } = createAgentDto;

    //!TODO: work will start from here next day
  }
}
