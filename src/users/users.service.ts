import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(username: string, password: string, email: string) {
    const newUser = new this.userModel({ username, password, email });
    const result = await newUser.save();
    console.log(result);
  }

  getUser() {}

  updateUser() {}
}
