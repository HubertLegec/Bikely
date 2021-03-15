import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { BikeType } from './bike.type';
import { BikeRequest } from './bikeRequest.dto';
import { BikesModule } from './bikes.module';
import { testModuleWithInMemoryDb } from '../utils/test-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { assert } from 'console';
<<<<<<< HEAD
=======
import { Model } from 'mongoose';
import { Bike } from './bike.model';

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

const patchTypeAndFrameSizeRequest = {
  type: 'city',
  frameSize: 15,
};
>>>>>>> main

describe('BikesController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
<<<<<<< HEAD
=======
  let bikeModel: Model<Bike>;
  let createdBikeId: string;
>>>>>>> main

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [BikesModule],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

<<<<<<< HEAD
=======
    bikeModel = module.get('BikeModel');
>>>>>>> main
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

<<<<<<< HEAD
  describe(`POST addBike`, () => {
=======
  beforeEach(async () => {
    const createdBike = await bikeModel.create(bikeRequestCorrect);
    createdBikeId = createdBike.id;
  });

  afterEach(async () => {
    await bikeModel.deleteMany({}).exec();
  });

  describe('GET /admin/bikes/:id', () => {
    it('should return correct bike', (done) => {
      const givenId = createdBikeId;
      request(app.getHttpServer())
        .get(`/admin/bikes/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            _id: createdBikeId,
            type: 'mtb',
            isElectric: false,
            frameSize: 20,
            __v: 0,
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const givenId = 'fakeId';
      request(app.getHttpServer())
        .get(`/admin/bikes/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not find bike with id: ${givenId}`]);
          done();
        });
    });
  });

  describe(`POST /admin/bikes/`, () => {
>>>>>>> main
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

<<<<<<< HEAD
=======
  describe('PATCH /admin/bikes/:id', () => {
    it('should return bike with applied patch', (done) => {
      const givenId = createdBikeId;
      request(app.getHttpServer())
        .patch(`/admin/bikes/${givenId}`)
        .send(patchTypeAndFrameSizeRequest)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .then(async () => {
          const bikesCount = await bikeModel.countDocuments({}).exec();
          expect(bikesCount).toEqual(1);
          const bike = await bikeModel.findOne({ _id: givenId }).exec();
          expect(bike.type).toEqual(BikeType.city);
          expect(bike.isElectric).toEqual(false);
          expect(bike.frameSize).toEqual(15);
          expect(bike.__v).toEqual(1);
          done();
        });
    });
  });

  describe('DELETE /admin/bikes/:id', () => {
    it('should remove bike with given ID', (done) => {
      const idToDelete = createdBikeId;
      request(app.getHttpServer())
        .delete(`/admin/bikes/${idToDelete}`)
        .expect(HttpStatus.OK)
        .then(async () => {
          const remainingBikes = await bikeModel.find({}).exec();
          expect(remainingBikes).toHaveLength(0);
          done();
        });
    });
    it('should return 404', async (done) => {
      const idToDelete = createdBikeId;
      await bikeModel.deleteOne({ _id: idToDelete });
      request(app.getHttpServer())
        .delete(`/admin/bikes/${idToDelete}`)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not delete bike with id: ${idToDelete}`]);
          done();
        });
    });
  });

>>>>>>> main
  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });
<<<<<<< HEAD

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
=======
>>>>>>> main
});
