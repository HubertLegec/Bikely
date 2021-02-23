import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userData: RegisterDTO) {
    if (await this.findByEmail(userData.email)) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new this.userModel(userData);

    const result = await newUser.save();
    if (result) return result.id;
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }, (err, user: User) => {
      if (err) return null;
      else return user;
    });
  }
}
