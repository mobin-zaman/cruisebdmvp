import { Body, Controller, Inject, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(@Inject(AgentService) private agentService: AgentService) {}

  @UseGuards(AdminGuard)
  @Post('/')
  createAgent(@Body() createAgentDto: CreateAgentDto) {
    await this.agentService.createAgent(createAgentDto);
  }
}
