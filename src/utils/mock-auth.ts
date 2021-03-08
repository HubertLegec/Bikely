import { PassportStrategy } from '@nestjs/passport';
import { GoogleDTO, LoginDTO } from '../auth/auth.dto';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockJWTStrategy extends PassportStrategy(JwtStrategy, 'jwt') {
  constructor() {
    const secret = 'test-secret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  validate(payload: LoginDTO | GoogleDTO, done: (error, success) => void) {
    done(null, payload);
  }
}
