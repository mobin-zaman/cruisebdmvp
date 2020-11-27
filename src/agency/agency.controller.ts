import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AgencyService } from './agency.service';
import { AddAgencyDto } from './dto/addAgency.dto';

@Controller('agency')
export class AgencyController {
  constructor(private agencyService: AgencyService) {}

  @UseGuards(AdminGuard)
  @Post('/')
  @UsePipes(ValidationPipe)
  addAgency(@Body() addAgencyDto: AddAgencyDto) {
    return this.agencyService.addAgency(addAgencyDto);
  }

  @UseGuards(AdminGuard)
  @Get('/')
  getAllAgency() {
    return this.agencyService.getAllAgency();
  }
}
