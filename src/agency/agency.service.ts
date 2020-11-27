import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './agency.entity';
import { AddAgencyDto } from './dto/addAgency.dto';

@Injectable()
export class AgencyService {

    constructor(
        @InjectRepository(Agency) private agencyRepository: Repository<Agency>
    ){}


    async addAgency(addAgencyDto: AddAgencyDto){
        const {agencyName} = addAgencyDto;

        const newAgency = new Agency();

        newAgency.agencyName = agencyName;

        await this.agencyRepository.save(newAgency);
    }

    async getAllAgency() {
        return await this.agencyRepository.find();
    }
}
