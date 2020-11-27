import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';

@Injectable()
export class AgentGuard implements CanActivate {
  constructor(private agentService: AgentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        console.log('No bearer token');
        throw new UnauthorizedException();
      }

      const firebaseIdToken = authHeader.replace('Bearer ', '');

      const user = await this.verifyIdToken(firebaseIdToken);

      request.user = user;

      return true;
    } catch (e) {
      throw e;
    }
  }

  async verifyIdToken(firebaseIdToken: string): Promise<Agent> {
    try {
      const agent: Agent = await this.agentService.getAgentByFirebaseIdToken(
        firebaseIdToken,
      );

      console.log('Agent: ', agent);

      //TODO: check this out
      if (!agent) {
        console.log('agent.guard.ts: not user ');
        throw new InternalServerErrorException();
      }

      return agent;
    } catch (e) {
      console.log('FIREBASE ID TOKEN ERROR: ', e.message);
      throw new UnauthorizedException();
    }
  }
}
