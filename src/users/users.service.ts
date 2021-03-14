import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';
import { RegisterDTO } from '../auth/auth.dto';
import { UserDTO } from './user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userData: RegisterDTO): Promise<null | User> {
    if (await this.findByEmail(userData.email)) return null;
    return await this.userModel.create(userData);
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.userModel.findOne({ email: email }).exec();
    if (!result) return null;
    return result;
  }

  async updateUserData({ id, password, ...rest }: UserDTO): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, rest, { new: true });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, { password });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
