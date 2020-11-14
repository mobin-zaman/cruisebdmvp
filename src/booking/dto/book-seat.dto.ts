import { IsNotEmpty } from 'class-validator';
import { IsBangladeshPhoneNumber } from '../custom-class-validator-decorator/bangladesh-phone-number.validator';
// import { IsOnlyDate } from '../custom-class-validator-decorator/custom-date-validator';

export class BookSeatDto {
  @IsNotEmpty()
  routeId: number;

  @IsNotEmpty()
  seatCategoryId: number;

  @IsNotEmpty()
  seatIds: string[];
  //TODO: is only date will be worked on later
  // @IsOnlyDate() //yyyy-mm-dd
  @IsNotEmpty()
  departureDate: string;

  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  @IsBangladeshPhoneNumber()
  mobileNumber: string;
}
