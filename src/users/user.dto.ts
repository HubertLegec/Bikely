import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class UserDTO {
  @IsString()
  @MinLength(5)
  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'password', format: 'password' })
  password: string;

  @IsString()
  @Length(24)
  @ApiProperty({ type: String, description: 'user id' })
  id: string;
}
