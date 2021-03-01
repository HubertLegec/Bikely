import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { RegisterDTO } from '../auth/auth.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserDTO } from './user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOkResponse({ description: 'Get user profile', type: UserDTO })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async getUserData(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user) return user;
    else throw new NotFoundException();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create user', type: UserDTO })
  @ApiBody({ type: RegisterDTO })
  async createUser(@Body() body: RegisterDTO) {
    const newUser = await this.usersService.create(body);
    if (!newUser) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    return newUser;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted', type: UserDTO })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.deleteUser(id);
    if (deletedUser) return deletedUser;
    else throw new NotFoundException();
  }

  @Post('update')
  @ApiOkResponse({ description: 'User updated', type: UserDTO })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: UserDTO })
  async updateUser(@Body() user: UserDTO) {
    const updatedUser = this.usersService.updateUserData(user);
    if (updatedUser) return updatedUser;
    else throw new NotFoundException();
  }
}
