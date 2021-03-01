import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthenticateDTO, GoogleDTO, LoginDTO, RegisterDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userData: AuthenticateDTO): Promise<any> {
    const { email, password } = userData;
    const user = await this.usersService.findByEmail(email);

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      } else return new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    } else return new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async googleLogin(user: GoogleDTO) {
    if (!user) throw new BadRequestException();
    return this.login(user);
  }

  async login(user: LoginDTO | GoogleDTO): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(userData: RegisterDTO): Promise<any> {
    return await this.usersService.create(userData);
  }
}
