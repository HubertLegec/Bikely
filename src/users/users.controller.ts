import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    console.log(username, password, email);
    const newUser = await this.usersService.create(username, password, email);
  }
}
