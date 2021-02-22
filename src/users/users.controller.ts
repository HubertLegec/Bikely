import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (user) return user;
    else throw new NotFoundException();
  }

  @Post()
  async createUser(@Request() req) {
    const newUser = await this.usersService.create(req.body);
    return newUser;
  }
}
