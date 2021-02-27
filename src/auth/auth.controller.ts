import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GoogleDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { RegisterDTO } from 'src/auth/auth.dto';

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
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user as GoogleDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'User Login' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginDTO })
  async login(@Body(ValidationPipe) body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  async register(@Body(ValidationPipe) body: RegisterDTO) {
    const result = await this.authService.register(body);
    if (result) return result;
  }
}
