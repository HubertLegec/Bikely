import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'User Login' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Request() req) {
    return this.authService.register(req.body);
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  whatever() {
    return 'działa';
  }
}
