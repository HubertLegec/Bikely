import { AuthService } from './auth.service';
import { User } from '../types/user';
import { UsersService } from '../users/users.service';
import { GoogleDTO } from '../auth/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/nestjs-testing';
import { Model } from 'mongoose';
import { RolesEnum } from '../types/roles';

const SALT_ROUNDS = 10;

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jwtService = new JwtService({});
    userService = new UsersService(createMock<Model<User>>({}));
    authService = new AuthService(userService, jwtService);
  });

  describe('validateUser', () => {
    it('Returns user', () => {
      const { email, password, ...rest } = mockUser();
      const foundUser = mockUserDoc({ password: 'password' });
      const expectedUser = mockUserDoc();
      delete expectedUser.password;
      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(foundUser as any);
      expect(authService.validateUser(email, password)).resolves.toMatchObject(expectedUser);
    });

    it('Returns null if credentials are invalid', () => {
      const { email, password, ...rest } = mockUser();
      const foundUser = mockUserDoc({ password: 'differentPassword' });

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(foundUser as any);
      expect(authService.validateUser(email, password)).resolves.toBe(null);
    });

    it('Returns null if user does not exists', () => {
      const { email, password, ...rest } = mockUser();

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(undefined);
      expect(authService.validateUser(email, password)).resolves.toBe(null);
    });
  });
  describe('login', () => {
    it('Receives GoogleDTO and returns access token', () => {
      const jwtToken = { access_token: 'jwtToken' };
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');
      expect(authService.login(googleDto)).resolves.toMatchObject(jwtToken);
    });

    it('Receives LoginDTO and returns access token', () => {
      const jwtToken = { access_token: 'jwtToken' };
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');
      expect(authService.login(mockUser())).resolves.toMatchObject(jwtToken);
    });
  });

  describe('googleLogin', () => {
    it('Returns jwtToken', () => {
      const jwtToken = { access_token: 'jwtToken' };
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');
      expect(authService.googleLogin(googleDto)).resolves.toMatchObject(jwtToken);
    });

    it('Return null if user data is empty', () => {
      expect(authService.googleLogin(null)).resolves.toBe(null);
    });
  });
  describe('register', () => {
    it('Returns user after successfully creating user', () => {
      const createdUser = mockUserDoc();
      delete createdUser.password;
      const expectedUser = mockUserDoc();
      delete expectedUser.password;
      jest.spyOn(userService, 'create').mockResolvedValueOnce(createdUser as User);
      expect(authService.register(mockUser())).resolves.toMatchObject(expectedUser);
    });
  });
});

const mockUser = (username = 'username', password = 'password', id = 'id', email = 'email@test.com') => {
  return {
    username,
    password,
    id,
    email,
  };
};

const googleDto: GoogleDTO = {
  firstName: 'firstName',
  lastName: 'familyName',
  id: 'id',
  email: 'email@test.com',
  role: RolesEnum.User,
};

const mockUserDoc = (mock?: Partial<User>): Partial<User> => {
  return {
    username: mock?.username || 'username',
    password: mock?.password ? bcrypt.hashSync(mock.password, SALT_ROUNDS) : bcrypt.hashSync('password', SALT_ROUNDS),
    id: mock?.id || 'id',
    email: mock?.email || 'email@test.com',
  };
};
