import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'http';
import { Repository } from 'typeorm';

@Injectable()
export class AgentService {
    constructor(
        @InjectRepository(Agent) private agentRepository:Repository<Agent>
    ) {}



}
