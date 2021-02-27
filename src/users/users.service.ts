import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';
import { RegisterDTO } from 'src/auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  sanitize(user: User) {
    return user ? user.depopulate('password') : user;
  }

  async create(userData: RegisterDTO): Promise<null | string> {
    try {
      if (await this.findByEmail(userData.email)) return null;
      const newUser = await this.userModel.create(userData);
      if (newUser) return newUser.id;
    } catch (err) {
      return err;
    }
  }

  async findById(id: string): Promise<User> {
    return this.sanitize(await this.userModel.findById(id));
  }

  async findByEmail(email: string) {
    const result = await this.userModel.findOne({ email: email }).exec();
    if (!result) return null;
    return result;
  }
}
