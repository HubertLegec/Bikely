import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDTO } from 'src/auth/auth.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn().mockImplementation(async (id: string) => {
              const user = usersList.find((user) => user.id === id);
              return user;
            }),
            create: jest
              .fn()
              .mockImplementation(async (userDTO: RegisterDTO) => {
                if (usersList.find((user) => user.email === userDTO.email)) {
                  throw new HttpException(
                    'User already exists',
                    HttpStatus.BAD_REQUEST,
                  );
                } else return 'id';
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(`GetUserById`, () => {
    it('Should return user', () => {
      expect(controller.getUserById('12345678')).resolves.toEqual(usersList[0]);
    });

    it('Should throw not found exception', async () => {
      expect(() => controller.getUserById('111')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('Should return user id', () => {
      expect(controller.createUser(createdUser)).resolves.toEqual('id');
    });

    it('Should throw error: user already exists', async () => {
      expect(() => controller.createUser(createdExistingUser)).rejects.toThrow(
        HttpException,
      );
    });
  });
});

const createdUser = {
  username: 'testName',
  email: 'test4@email.com',
  password: '11111111',
};

const createdExistingUser = {
  username: 'testName',
  email: 'test3@email.com',
  password: '11111111',
};

const usersList = [
  {
    username: 'testName',
    email: 'test@email.com',
    id: '12345678',
    created: 1614115718641,
    password: '11111111',
  },
  {
    username: 'testName2',
    email: 'test2@email.com',
    id: '1234',
    created: 1614115718641,
    password: '11111111',
  },
  {
    username: 'testName3',
    email: 'test3@email.com',
    id: '5678',
    created: 1614115718641,
    password: '11111111',
  },
];
