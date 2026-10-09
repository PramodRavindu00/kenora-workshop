import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @IsUUID()
  workshopId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
