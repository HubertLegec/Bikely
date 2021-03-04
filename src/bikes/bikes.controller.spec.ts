import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { BikeType } from './bike.type';
import { BikeRequest } from './bikeRequest.dto';
import { BikesController } from './bikes.controller';
import { BikesModule } from './bikes.module';
import { BikesService } from './bikes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bike } from './bike.model';

describe('BikesController', () => {
  let app: INestApplication;
  let bikeModel: Model<Bike>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BikesModule],
      controllers: [BikesController],
      providers: [BikesService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe(`POST addBike`, () => {
    it(`Should return bike id`, async () => {
      return await request(app.getHttpServer())
        .post('/admin/bikes')
        .send(bikeRequestCorrect)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .end();
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const bikeRequestCorrect: BikeRequest = {
    type: BikeType.mtb,
    isElectric: false,
    frameSize: 20,
  };
});
