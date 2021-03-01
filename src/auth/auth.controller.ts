import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
    return this.authService.googleLogin(req.user as GoogleDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'User logged in', type: JWTResponse })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginDTO })
  async login(@Body(ValidationPipe) body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ description: 'User registered', type: UserDTO })
  @ApiBadRequestResponse({ description: 'User already exists' })
  async register(@Body(ValidationPipe) body: RegisterDTO) {
    const result = await this.authService.register(body);
    if (result) return result;
    else throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
  }
}
