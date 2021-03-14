import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { GoogleDTO, JWTResponse, LoginDTO, RegisterDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      } else return null;
    } else return null;
  }

  async googleLogin(user: GoogleDTO) {
    if (!user) return null;
    return this.login(user);
  }

  async login(user: LoginDTO | GoogleDTO): Promise<JWTResponse> {
    let userData;
    if (!user.hasOwnProperty('role')) {
      userData = await this.usersService.findByEmail(user.email);
    } else userData = user;

    const payload = { email: user.email, sub: user.id, role: userData.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(userData: RegisterDTO): Promise<any> {
    return await this.usersService.create(userData);
  }
}
