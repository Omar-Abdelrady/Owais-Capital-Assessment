import {
  IsEmail,
  IsNumberString,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsNumberString()
  mobile: string;

  @IsString()
  address: string;

  @IsNumberString()
  zip: number;
}
