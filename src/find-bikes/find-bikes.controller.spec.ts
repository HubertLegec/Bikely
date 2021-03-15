import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { FindBikesModule } from './find-bikes.module';
import { testModuleWithInMemoryDb } from '../utils/test-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

describe('FindBikesController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [FindBikesModule],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`Should return HttpStatus.OK`, (done) => {
    request(app.getHttpServer()).get('/bikes').expect(HttpStatus.OK, done);
  });

  it(`Should return a JSON`, (done) => {
    request(app.getHttpServer()).get('/bikes').expect('Content-Type', /json/, done);
  });

  it(`Should return an array`, (done) => {
    request(app.getHttpServer()).get('/bikes').expect([], done);
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });
});
