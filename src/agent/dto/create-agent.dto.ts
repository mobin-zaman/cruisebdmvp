import { IsEmail, IsNotEmpty } from 'class-validator';
// import { IsOnlyDate } from '../custom-class-validator-decorator/custom-date-validator';

export class CreateAgentDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  agencyId: number;
}
