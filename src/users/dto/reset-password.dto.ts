import { IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class RestPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  password: string;
  @Length(5)
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
