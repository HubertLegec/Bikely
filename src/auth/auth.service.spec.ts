import { AuthService } from './auth.service';
import { User } from '../types/user';
import { UsersService } from '../users/users.service';
import { HttpException, BadRequestException, HttpStatus } from '@nestjs/common';
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
      const { id, username, ...inputData } = mockUser();
      const foundUser = mockUserDoc({ password: 'password' });
      const { password, ...result } = mockUserDoc();
      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(foundUser as any);
      expect(authService.validateUser(inputData)).resolves.toMatchObject(result);
    });

    it('returns unauthorized', () => {
      const { id, username, ...inputData } = mockUser();
      const foundUser = mockUserDoc({ password: 'differentPassword' });

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(foundUser as any);
      expect(authService.validateUser(inputData)).resolves.toMatchObject(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });

    it('Throws not found', () => {
      const { id, username, ...inputData } = mockUser();

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(undefined);
      expect(authService.validateUser(inputData)).resolves.toMatchObject(
        new HttpException('User does not exist', HttpStatus.NOT_FOUND),
      );
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

    it('Throws bad request exception', () => {
      expect(() => authService.googleLogin(null)).rejects.toThrow(BadRequestException);
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
