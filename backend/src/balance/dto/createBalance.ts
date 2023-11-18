import { IsNumber } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  balance: number;
}
