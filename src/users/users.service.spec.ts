import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User } from 'src/types/user';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUserDoc()),
            constructor: jest.fn().mockResolvedValue(mockUserDoc()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            findById: jest.fn(async (id: string) => {
              return usersDocList.find((user) => user.id === id);
            }),
            depopulate: jest.fn(function (val: string) {
              return this;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('Should return an user', async () => {
      const inputId = 'id2';
      const userDocWithId = usersDocList.find((user) => (user.id = inputId));
      const returnedUser = await service.findById(inputId);
      expect(returnedUser).toEqual(userDocWithId);
    });

    it('Should return undefined', async () => {
      const inputId = '432987532';
      const returnedUser = await service.findById(inputId);
      expect(returnedUser).toEqual(undefined);
    });
  });

  describe('create', () => {
    it('Should create user', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(undefined),
        }),
      );
      jest.spyOn(model, 'create').mockReturnValueOnce(mockUserDoc() as any);
      expect(service.create(newUser)).resolves.toEqual('id');
    });

    it('Should throw HttpException', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(mockUserDoc() as any),
        }),
      );
      expect(service.create(usersList[0])).rejects.toThrowError(HttpException);
    });
  });

  describe('findByEmail', () => {
    it('Returns user', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(usersDocList[0] as any),
        }),
      );
      expect(service.findByEmail('email@test.com')).resolves.toEqual(
        usersDocList[0],
      );
    });

    it('Returns null', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(undefined),
        }),
      );
      expect(service.findByEmail('NotExistingEmail')).resolves.toEqual(null);
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

const mockUserDoc = (mock?: Partial<User>): Partial<User> => {
  return {
    username: mock?.username || 'username',
    password: mock?.password || 'password',
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
