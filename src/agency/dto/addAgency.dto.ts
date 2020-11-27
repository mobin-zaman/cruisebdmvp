import { IsNotEmpty } from 'class-validator';
// import { IsOnlyDate } from '../custom-class-validator-decorator/custom-date-validator';

export class AddAgencyDto {
  @IsNotEmpty()
  agencyName: string;
}
