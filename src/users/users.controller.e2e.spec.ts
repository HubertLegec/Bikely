import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

import { testModuleWithInMemoryDb, validJWTToken } from '../utils/test-utils';
import { UsersModule } from './users.module';
import { LoginDTO, RegisterDTO } from '../auth/auth.dto';
import { MockJWTStrategy } from '../utils/mock-auth';
import { UserDTO } from './user.dto';

const usersWithIncorrectData: Array<RegisterDTO> = [
  {
    username: 'username',
    email: 'notEmail',
    password: 'password',
  },
  {
    username: 'username',
    email: 'test@test.com',
    password: 'wrong',
  },
  {
    username: 'bad',
    email: 'test@test.com',
    password: 'password',
  },
];

const usersWithIncorrectDataDescription = ['invalid email', 'invalid password', 'invalid username'];

const mockUser: RegisterDTO = {
  username: 'username',
  email: 'test@test.com',
  password: 'testtest',
};

const loggedUser: LoginDTO = {
  id: '1234567891234567891234',
  email: 'test@test.com',
  password: 'somePassword',
};

const userThatDoesNotExist: LoginDTO = {
  id: '1234567891234567899876',
  email: 'test@notExisting.com',
  password: 'somePassword',
};

const updatedUser: UserDTO = {
  username: 'username',
  email: 'test3@test.com',
  password: 'longEnoughPassword',
  id: '60366785983f5b1dd0dc51ab',
};

const userThatDoesNotExistWithID: UserDTO = {
  username: 'anotherUsername',
  email: 'test#@test.com',
  password: 'DifferentPassword',
  id: '60366784973f5b1dd0dc51ab',
};

describe('UsersController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [UsersModule],
      providers: [MockJWTStrategy],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /', () => {
    it('Should return Unauthorized', (done) => {
      return request(app.getHttpServer())
        .post('/users')
        .send(mockUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED, done);
    });

    it('Should return user id', (done) => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(mockUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          updatedUser.id = response.body.id;
          done();
        });
    });

    usersWithIncorrectData.forEach((user, index) => {
      it(`Should not accept ${usersWithIncorrectDataDescription[index]}`, (done) => {
        request(app.getHttpServer())
          .post('/users')
          .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.BAD_REQUEST, done);
      });
    });

    it('Should return BAD_REQUEST error if user exists', (done) => {
      request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(mockUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST, done);
    });
  });

  describe('GET /me', () => {
    it('Should return Unauthorized', (done) => {
      return request(app.getHttpServer())
        .get('/users/me')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED, done);
    });

    it('Should return user data', (done) => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK, done);
    });

    it('Should return user NOT_FOUND if user with given email does not exists', (done) => {
      request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${validJWTToken(userThatDoesNotExist)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND, done);
    });
  });
  describe('PUT /', () => {
    it('Should return Unauthorized', (done) => {
      return request(app.getHttpServer())
        .put('/users')
        .send(updatedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED, done);
    });

    it('Should return user data', (done) => {
      return request(app.getHttpServer())
        .put('/users')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(updatedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((response) => {
          const expectedUserData = response.body;
          const { password, ...matchedUserData } = updatedUser;
          expect(expectedUserData).toMatchObject(matchedUserData);
          done();
        });
    });

    usersWithIncorrectData.forEach((user, index) => {
      it(`Should not accept ${usersWithIncorrectDataDescription[index]}`, (done) => {
        request(app.getHttpServer())
          .put('/users')
          .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.BAD_REQUEST, done);
      });
    });

    it('Should return NOT_FOUND if user does not exists', (done) => {
      request(app.getHttpServer())
        .put('/users')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(userThatDoesNotExistWithID)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND, done);
    });
  });

  describe('DELETE /:id', () => {
    it('Should return Unauthorized', (done) => {
      return request(app.getHttpServer())
        .delete(`/users/${updatedUser.id}`)
        .send(updatedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED, done);
    });

    it('Should return NOT_FOUND if user does not exists', (done) => {
      request(app.getHttpServer())
        .delete(`/users/${userThatDoesNotExistWithID.id}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND, done);
    });

    it('Should return user data', (done) => {
      return request(app.getHttpServer())
        .put('/users')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(updatedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((response) => {
          const expectedUserData = response.body;
          const { password, ...matchedUserData } = updatedUser;
          expect(expectedUserData).toMatchObject(matchedUserData);
          done();
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });
});
