import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userData: User) {
    if (await this.findByEmail(userData.email)) {
      return 'email is already in use';
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = new this.userModel({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
    });

    const result = await newUser.save();
    if (result) return result.id;
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
}
