import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { RegisterDTO } from 'src/auth/auth.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Get user profile' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (user) return user;
    throw new NotFoundException();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create user' })
  async createUser(@Body() body: RegisterDTO) {
    const newUser = await this.usersService.create(body);
    return newUser;
  }
}
