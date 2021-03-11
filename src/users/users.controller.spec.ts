import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDTO } from '../auth/auth.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../types/user';
import { mockUserDoc } from '../utils/test-utils';
import { Model } from 'mongoose';
import { createMock } from '@golevelup/nestjs-testing';
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    service = new UsersService(createMock<Model<User>>({}));
    controller = new UsersController(service);
    service.findById = jest.fn().mockImplementation(async (id: string) => {
      return findMockUserById(id);
    });
    service.create = jest.fn().mockImplementation(async (userDTO: RegisterDTO) => {
      if (usersList.find((user) => user.email === userDTO.email)) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      } else return mockUserDoc(userDTO);
    });
    service.findByEmail = jest.fn().mockImplementation(async (email: string) => {
      const user = findMockUserEmail(email);
      return user ? mockUserDoc(user) : null;
    });
    service.deleteUser = jest.fn().mockImplementation(async (id: string) => {
      const user = findMockUserById(id);
      return user ? mockUserDoc(user) : null;
    });
  });

  describe(`GET /users/me`, () => {
    it('Should return user', () => {
      expect(controller.getUserData({ user: usersList[0] })).resolves.toMatchObject(
        mockUserDoc(usersList[0]).toObject(),
      );
    });

    it('Should throw not found exception', () => {
      expect(() => controller.getUserData({ user: { email: 'NotExistingEmail' } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /users/', () => {
    it('Should return user', () => {
      expect(controller.createUser(createdUser)).resolves.toMatchObject(mockUserDoc(createdUser).toObject());
    });

    it('Should throw error: user already exists', () => {
      expect(() => controller.createUser(createdExistingUser)).rejects.toThrow(HttpException);
    });
  });

  describe('DELETE /users/:id', () => {
    it('Should return deleted user', async () => {
      const deletedUser = await controller.deleteUser(usersList[0].id);
      expect(deletedUser.toObject()).toMatchObject(mockUserDoc(usersList[0]).toObject());
    });

    it('Should throw NotFoundException', () => {
      expect(() => controller.deleteUser('notExistingId')).rejects.toThrow(new NotFoundException());
    });
  });

  describe('PUT /users', () => {
    it('Should return updated user', () => {
      jest.spyOn(service, 'updateUserData').mockResolvedValueOnce(mockUserDoc() as User);
      expect(controller.updateUser(usersList[0])).resolves.toMatchObject(mockUserDoc().toObject());
    });

    it('Should throw not found exception', () => {
      jest.spyOn(service, 'updateUserData').mockRejectedValueOnce(new NotFoundException());
      expect(() => controller.updateUser(usersList[0])).rejects.toThrow(new NotFoundException());
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
    password: '11111111',
  },
  {
    username: 'testName2',
    email: 'test2@email.com',
    id: '1234',
    password: '11111111',
  },
  {
    username: 'testName3',
    email: 'test3@email.com',
    id: '5678',
    password: '11111111',
  },
];

function findMockUserById(id: string) {
  return usersList.find((user) => user.id === id);
}

function findMockUserEmail(email: string) {
  return usersList.find((user) => user.email === email);
}
