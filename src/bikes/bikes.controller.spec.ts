import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { BikeType } from './bike.type';
import { BikeRequest } from './bikeRequest.dto';
import { BikesModule } from './bikes.module';
import { testModuleWithInMemoryDb } from '../utils/test-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { assert } from 'console';

describe('BikesController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [BikesModule],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe(`POST addBike`, () => {
    it(`Should return HttpStatus.CREATED`, (done) => {
      request(app.getHttpServer())
        .post('/admin/bikes')
        .send(bikeRequestCorrect)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED, done);
    });

    it(`Should return HttpStatus.BAD_REQUEST`, (done) => {
      request(app.getHttpServer())
        .post('/admin/bikes')
        .send(bikeRequestIncorrectType)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST, done);
    });

    it(`Should return HttpStatus.BAD_REQUEST`, (done) => {
      request(app.getHttpServer())
        .post('/admin/bikes')
        .send(bikeRequestIncorrectFrameSize)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          assert(res.body.message, ['frameSize must not be less than 15']);
          done();
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  const bikeRequestCorrect: BikeRequest = {
    type: BikeType.mtb,
    isElectric: false,
    frameSize: 20,
  };
  const bikeRequestIncorrectType = {
    type: 'test',
    isElectric: true,
    frameSize: 20,
  };
  const bikeRequestIncorrectFrameSize = {
    type: BikeType.city,
    isElectric: false,
    frameSize: 2,
  };
});
