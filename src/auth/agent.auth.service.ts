import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentService) private agentRepository: Repository<Agent>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  async getAgentByFirebaseIdToken(firebaseIdToken: string): Promise<Agent> {
    try {
      const uid = await this.firebaseService.getUidFromFirebaseIdToken(
        firebaseIdToken,
      );
      console.log('uid: ', uid);
      //
      return await this.agentRepository.findOne({
        firebase_uid: uid,
      });
    } catch (e) {
      console.log('ERROR: agentService.getAgentByFirebaseIdToken: ', e.message);
      throw e;
    }
  }
}
