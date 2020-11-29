import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../auth/agent.entity';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { Agency } from 'src/agency/agency.entity';
import { FirebaseService } from 'src/auth/firebase.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private agentRepository: Repository<Agent>,
    @InjectRepository(Agency) private agencyRepository: Repository<Agency>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  public async createAgent(createAgentDto: CreateAgentDto) {
    const { name, email, phoneNumber, agencyId } = createAgentDto;

    const newAgent: Agent = new Agent();

    //TODO: add validate if name and email exists pipe for the the dto
    newAgent.name = name;
    newAgent.email = email;
    //TODO: add validate phone number pipe
    newAgent.phoneNumber = phoneNumber;
    //TODO: add agencyId validation as well
    newAgent.agency = await this.agencyRepository.findOne(agencyId);

    //now we create a firebase user
    const { uid, password } = await this.firebaseService.createNewUser(email);

    newAgent.initialPassword = password;
    newAgent.firebase_uid = uid;

    await this.agentRepository.save(newAgent);
  }
}
