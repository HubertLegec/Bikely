import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from 'src/types/user';
import { UsersService } from '../users/users.service';
import { HttpException, BadRequestException } from '@nestjs/common';
import { RegisterDTO } from 'src/auth/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GoogleDTO } from '../../dist/auth/auth.dto';

const SALT_ROUNDS = 10;

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('Returns user', async () => {
      const { id, username, ...inputData } = mockUser();
      const foundUser = mockUserDoc({ password: 'password' });
      const { password, ...result } = mockUserDoc();
      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(foundUser as any);
      expect(authService.validateUser(inputData)).resolves.toEqual(result);
    });

    it('Throws unauthorized', async () => {
      const { id, username, ...inputData } = mockUser();
      const foundUser = mockUserDoc({ password: 'differentPassword' });

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(foundUser as any);
      expect(authService.validateUser(inputData)).rejects.toThrowError(
        HttpException,
      );
    });

    it('Throws not found', () => {
      const { id, username, ...inputData } = mockUser();

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(undefined);
      expect(authService.validateUser(inputData)).rejects.toThrowError(
        HttpException,
      );
    });

    describe('login', () => {
      it('Receives GoogleDTO and returns access token', () => {
        const jwtToken = { access_token: 'jwtToken' };
        jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');
        expect(authService.login(googleDto)).resolves.toBe(jwtToken);
      });

      it('Receives LoginDTO and returns access token', () => {
        const jwtToken = { access_token: 'jwtToken' };
        jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');
        expect(authService.login(mockUser())).resolves.toBe(jwtToken);
      });
    });

    describe('googleLogin', () => {
      it('Returns jwtToken', () => {
        const jwtToken = { access_token: 'jwtToken' };
        jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwtToken');
        expect(authService.googleLogin(googleDto)).resolves.toBe(jwtToken);
      });

      it('Throws bad request exception', async () => {
        expect(() => authService.googleLogin(null)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
    describe('register', () => {
      it('Returns user id after successfully creating user', () => {
        jest.spyOn(userService, 'create').mockResolvedValueOnce('some id');
        expect(authService.register(mockUser())).resolves.toBe('some id');
      });
    });
  });
});

const mockUser = (
  username = 'username',
  password = 'password',
  id = 'id',
  email = 'email@test.com',
) => {
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
};

const mockUserDoc = (mock?: Partial<User>): Partial<User> => {
  return {
    username: mock?.username || 'username',
    password: mock?.password
      ? bcrypt.hashSync(mock.password, SALT_ROUNDS)
      : bcrypt.hashSync('password', SALT_ROUNDS),
    id: mock?.id || 'id',
    email: mock?.email || 'email@test.com',
    depopulate(path: string) {
      return this;
    },
  };
};

const newUser = mockUser('test4', 'password4', 'id4', 'email4@test.com');

const usersList = [
  mockUser(),
  mockUser('test2', 'password2', 'id2', 'email2@test.com'),
  mockUser('test3', 'password3', 'id3', 'email3@test.com'),
];

const usersDocList = [
  mockUserDoc(),
  mockUserDoc(usersList[1]),
  mockUserDoc(usersList[2]),
];
