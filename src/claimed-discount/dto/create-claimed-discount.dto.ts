import { IsString } from 'class-validator';

export class CreateClaimedDiscountDto {
  @IsString()
  discountId: string;
}
