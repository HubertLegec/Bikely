import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class JWTResponse {
  @IsString()
  @ApiProperty({ type: String, description: 'JWT' })
  access_token: string;
}

export class LoginDTO {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'password' })
  password: string;

  @Length(24)
  @IsString()
  @ApiProperty({ type: String, description: 'User id' })
  id: string;
}

export class RegisterDTO {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'password' })
  password: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({ type: String, description: 'username' })
  username: string;
}
export interface AuthenticateDTO {
  email: string;
  password: string;
}

export class GoogleDTO {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @ApiProperty({ type: String, description: 'first name' })
  firstName: string;

  @IsString()
  @ApiProperty({ type: String, description: 'last name' })
  lastName: string;

  @Length(24)
  @IsString()
  @ApiProperty({ type: String, description: 'Google user id' })
  id: string;
}
