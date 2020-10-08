import { IsNotEmpty } from 'class-validator';

export class GetSeatCategoryInfoDto {
  @IsNotEmpty()
  shipId: number;
  @IsNotEmpty()
  categoryId: number;
  @IsNotEmpty()
  routeId: number;
}
