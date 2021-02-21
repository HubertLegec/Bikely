import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(username: string, password: string, email: string) {
    const newUser = new this.userModel({ username, password, email });
    const result = await newUser.save();
    return result.id;
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }, (err, user: User) => {
      if (err) NotFoundException;
      else return user;
    });
  }

  async findOrCreate(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user) return user;
    else this.create('', '', email);
  }
}
