import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { testModuleWithInMemoryDb } from '../utils/test-utils';
import { UsersModule } from '../users/users.module';
import { MockJwtModule, MockJWTStrategy } from '../utils/mock-auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { LocalStrategy } from './strategies/local.strategy';

const mockUser: RegisterDTO = {
  username: 'username',
  email: 'test@test.com',
  password: 'testtest',
};

let registeredMockUser;

const usersWithIncorrectLoginData: Array<LoginDTO> = [
  {
    id: 'notValidId',
    email: 'test@test.com',
    password: 'password',
  },
  {
    id: 'someRandomId1234567890',
    email: 'test@test.com',
    password: 'notVali',
  },
];

const userThatDoesNotExist: LoginDTO = {
  id: 'someRandomId1234567890',
  email: 'NotValidEmail',
  password: 'password',
};

const usersWithIncorrectLoginDescription = ['invalid id', 'invalid password'];

const usersWithIncorrectRegisterData = [
  {
    email: 'notEmail',
    password: 'password',
    username: 'username',
  },
  {
    email: 'test@test.com',
    password: 'wrong',
    username: 'username',
  },
  {
    email: 'test@test.com',
    password: 'password',
    username: 'user',
  },
];

const usersWithIncorrectRegisterDescription = ['invalid email', 'invalid password', 'invalid username'];

describe('AuthController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [UsersModule, MockJwtModule],
      controllers: [AuthController],
      providers: [AuthService, MockJWTStrategy, LocalStrategy],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST auth/register', () => {
    it('Should return user data', (done) => {
      request(app.getHttpServer())
        .post('/auth/register')
        .send(mockUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          registeredMockUser = response.body;
          registeredMockUser.password = mockUser.password;
          done();
        });
    });

    usersWithIncorrectRegisterData.forEach((user, index) => {
      it(`Should not accept invalid ${usersWithIncorrectRegisterDescription[index]}`, (done) => {
        request(app.getHttpServer())
          .post('/auth/register')
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.BAD_REQUEST, done);
      });
    });

    it('Should return bad request error if user exists', (done) => {
      request(app.getHttpServer())
        .post('/auth/register')
        .send(registeredMockUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST, done);
    });
  });

  describe('POST auth/login', () => {
    it('Should return JWT', (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send(registeredMockUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK, done);
    });

    usersWithIncorrectLoginData.forEach((user, index) => {
      it(`Should not accept ${usersWithIncorrectLoginDescription[index]}`, (done) => {
        request(app.getHttpServer())
          .post('/auth/login')
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.UNAUTHORIZED, done);
      });
    });

    it(`Should return UNAUTHORIZED if user does not exists`, (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send(userThatDoesNotExist)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED, done);
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });
});
