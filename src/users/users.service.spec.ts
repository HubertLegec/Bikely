import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User } from 'src/types/user';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';
import { mockUserDoc } from '../utils/test-utils';

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
            findByIdAndDelete: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findById: jest.fn(async (id: string) => {
              return usersDocList.find((user) => user.id === id);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
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
    it('Should return id after creating user', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      );
      jest.spyOn(model, 'create').mockReturnValueOnce(newUser as any);
      expect(service.create(newUser)).resolves.toEqual(newUser);
    });

    it('Should return error from database', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockRejectedValueOnce(new HttpException('database error', HttpStatus.INTERNAL_SERVER_ERROR)),
        }),
      );
      expect(service.create(usersList[0])).resolves.toThrow(
        new HttpException('database error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('Should return null if user already exists', () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(mockUserDoc() as any);
      expect(service.create(mockUser())).resolves.toEqual(null);
    });
  });

  describe('findByEmail', () => {
    it('Returns user', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(usersDocList[0] as any),
        }),
      );
      expect(service.findByEmail('email@test.com')).resolves.toEqual(usersDocList[0]);
    });

    it('Throws user not found', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockRejectedValueOnce(new NotFoundException()),
        }),
      );
      expect(() => service.findByEmail('NotExistingEmail')).rejects.toThrow(new NotFoundException());
    });
  });

  describe('updateUserData', () => {
    it('Returns updated user', () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(usersDocList[1] as any);
      expect(service.updateUserData(usersList[1])).resolves.toEqual(usersDocList[1]);
    });

    it('Throws not found error', () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockRejectedValueOnce(new NotFoundException());
      expect(() => service.updateUserData(mockUser())).rejects.toThrow(new NotFoundException());
    });
  });

  describe('updatePassword', () => {
    it('Returns updated user', () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(usersDocList[1] as any);
      expect(service.updatePassword('id', 'password')).resolves.toEqual(usersDocList[1]);
    });

    it('Throws not found error', () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockRejectedValue(new NotFoundException());
      expect(() => service.updatePassword('id', 'password')).rejects.toThrow(new NotFoundException());
    });
  });

  describe('deleteUser', () => {
    it('Returns deleted user', () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(usersDocList[1] as any);
      expect(service.deleteUser('id')).resolves.toEqual(usersDocList[1]);
    });

    it('Throws not found error', () => {
      jest.spyOn(model, 'findByIdAndDelete').mockRejectedValue(new NotFoundException());
      expect(() => service.deleteUser('id')).rejects.toThrow(new NotFoundException());
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

const newUser = mockUser('test4', 'password4', 'id4', 'email4@test.com');

const usersList = [
  mockUser(),
  mockUser('test2', 'password2', 'id2', 'email2@test.com'),
  mockUser('test3', 'password3', 'id3', 'email3@test.com'),
];

const usersDocList = [mockUserDoc(), mockUserDoc(usersList[1]), mockUserDoc(usersList[2])];
