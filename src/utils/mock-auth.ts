import { PassportStrategy } from '@nestjs/passport';
import { GoogleDTO, LoginDTO } from '../auth/auth.dto';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

const SECRET = 'test-secret';

@Injectable()
export class MockJWTStrategy extends PassportStrategy(JwtStrategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    });
  }

  validate(payload: LoginDTO | GoogleDTO, done: (error, success) => void) {
    done(null, payload);
  }
}

export const MockJwtModule = JwtModule.register({ secret: SECRET });

@Injectable()
export class MockLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (user) return user;
    else throw new UnauthorizedException();
  }
}
