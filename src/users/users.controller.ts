import { Body, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { RegisterDTO } from 'src/auth/auth.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiOkResponse({ description: 'Get user profile' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async getUserById(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user) return user;
    else throw new InternalServerErrorException();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create user' })
  async createUser(@Body() body: RegisterDTO) {
    const newUser = await this.usersService.create(body);
    return newUser;
  }
}
