import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from 'src/auth/auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('Returns jwt token', async () => {
      jest.spyOn(service, 'login').mockResolvedValueOnce(objectWithAccessToken);
      expect(controller.login(loginData)).resolves.toEqual(objectWithAccessToken);
    });

    it('Returns an error', () => {
      jest.spyOn(service, 'register').mockRejectedValueOnce(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));
      expect(controller.register(registerData)).rejects.toThrowError(HttpException);
    });
  });

  describe('register', () => {
    it('Returns id of created user', () => {
      jest.spyOn(service, 'register').mockResolvedValueOnce('id');
      expect(controller.register(registerData)).resolves.toEqual('id');
    });

    it('Returns an error', () => {
      jest.spyOn(service, 'register').mockRejectedValueOnce(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));
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
