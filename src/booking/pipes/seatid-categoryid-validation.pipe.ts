import {
  PipeTransform,
  BadRequestException,
  Type,
  ArgumentMetadata,
  Inject,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SeatidCategoryidValidationPipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata): any {
    console.log('getting the value: ', value);
    return value;
  }
}
