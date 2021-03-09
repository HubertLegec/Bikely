import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { mockUserDoc } from '../utils/test-utils';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  describe('POST /auth/login', () => {
    it('Returns jwt token', () => {
      jest.spyOn(service, 'login').mockResolvedValueOnce(objectWithAccessToken);
      expect(controller.login(loginData)).resolves.toEqual(objectWithAccessToken);
    });

    it('Returns an error', () => {
      jest.spyOn(service, 'login').mockRejectedValueOnce(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));
      expect(controller.login(loginData)).rejects.toThrowError(HttpException);
    });
  });

  describe('register', () => {
    it('Returns returns user data after registration', () => {
      jest.spyOn(service, 'register').mockResolvedValueOnce(mockUserDoc(registerData));
      expect(controller.register(registerData)).resolves.toMatchObject(mockUserDoc(registerData).toObject());
    });

    it('Returns an error if user already exists', () => {
      jest.spyOn(service, 'register').mockRejectedValueOnce(new HttpException('Unauthorized', HttpStatus.BAD_REQUEST));
      expect(controller.register(registerData)).rejects.toThrowError(HttpException);
    });
  });
});

const loginData: LoginDTO = {
  email: 'test@test.com',
  id: 'id',
  password: 'password',
};

const registerData: RegisterDTO = {
  username: 'username',
  password: 'password',
  email: 'test@test.com',
};

const objectWithAccessToken = { access_token: '123.456.789' };
