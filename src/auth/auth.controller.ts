import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesEnum } from '../types/roles';
import { userTransformFunction } from '../types/user';
import { UserDTO } from '../users/user.dto';
import { GoogleDTO, JWTResponse, LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {
    // redirect to google authorization site
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  @ApiOkResponse({ description: 'User Logged in', type: JWTResponse })
  async googleAuthRedirect(@Req() req) {
    req.user.role = RolesEnum.User;
    const result = this.authService.googleLogin(req.user as GoogleDTO);
    if (result) return result;
    throw new BadRequestException();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'User logged in', type: JWTResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginDTO })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ description: 'User registered', type: UserDTO })
  @ApiBadRequestResponse({ description: 'User already exists' })
  async register(@Body() body: RegisterDTO) {
    const result = await this.authService.register(body);
    if (result) return result.toObject({ transform: userTransformFunction });
    else throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
  }
}
