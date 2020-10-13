import { IsDate, IsNotEmpty } from 'class-validator';
import { IsOnlyDate } from '../custom-class-validator-decorator/custom-date-validator';

export class GetSeatCategoryInfoDto {
  @IsNotEmpty()
  seatCategoryId: number;
  @IsNotEmpty()
  routeId: number;
  // @IsOnlyDate() //yyyy-mm-dd
  @IsNotEmpty()
  departureDate: string;
}
