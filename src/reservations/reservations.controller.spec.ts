import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Rent } from 'src/rent/rent.model';
import { testModuleWithInMemoryDb } from '../utils/test-utils';
import { ReservationsModule } from './reservations.module';
import { assert } from 'console';

const reservationRequestCorrect = {
  bike_id: '604bf99597d75d9420ec2e5d',
  user_id: '604bf99597d75d9420ec2e5d',
  plannedDateFrom: '2021-03-14',
  plannedDateTo: '2021-03-14',
  rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
  rentalPointTo_id: '604bf99597d75d9420ec2e5d',
};
const reservationRequestIncorrectBikeId = {
  bike_id: 'incorrectId',
  user_id: '604bf99597d75d9420ec2e5d',
  plannedDateFrom: '2021-03-14',
  plannedDateTo: '2021-03-14',
  rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
  rentalPointTo_id: '604bf99597d75d9420ec2e5d',
};
const rentRequestCorrect = {
  bike_id: '604bf99597d75d9420ec2e5a',
  user_id: '604bf99597d75d9420ec2e5a',
  plannedDateFrom: '2021-03-14',
  plannedDateTo: '2021-03-14',
  actualDateFrom: '2021-03-14',
  actualDateTo: '2021-03-14',
  rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
  rentalPointTo_id: '604bf99597d75d9420ec2e5d',
};

const reservationsRequests = [reservationRequestCorrect, rentRequestCorrect];

const patchRentalPointFromRequest = {
  rentalPointFrom_id: '604bf99597d75d9420ec2e5a',
};

describe('ReservationsController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let rentModel: Model<Rent>;
  let createdReservationId: string;
  let createdRentId: string;

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [ReservationsModule],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

    rentModel = module.get('RentModel');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const createdReservations = await rentModel.create(reservationsRequests);
    createdReservationId = createdReservations[0].id;
    createdRentId = createdReservations[1].id;
  });

  afterEach(async () => {
    await rentModel.deleteMany({}).exec();
  });

  describe(`POST /reservations/`, () => {
    it(`Should return HttpStatus.CREATED`, (done) => {
      request(app.getHttpServer())
        .post('/reservations')
        .send(reservationRequestCorrect)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED, done);
    });

    it(`Should return HttpStatus.BAD_REQUEST`, (done) => {
      request(app.getHttpServer())
        .post('/reservations')
        .send(reservationRequestIncorrectBikeId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          assert(res.body.message, ['bike_id must be a mongodb id']);
          done();
        });
    });
  });

  describe('GET /reservations/:id', () => {
    it('should return correct reservation', (done) => {
      const givenId = createdReservationId;
      request(app.getHttpServer())
        .get(`/reservations/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            id: createdReservationId,
            bike_id: '604bf99597d75d9420ec2e5d',
            user_id: '604bf99597d75d9420ec2e5d',
            plannedDateFrom: '2021-03-14T00:00:00.000Z',
            plannedDateTo: '2021-03-14T00:00:00.000Z',
            rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
            rentalPointTo_id: '604bf99597d75d9420ec2e5d',
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const givenId = 'fakeId';
      request(app.getHttpServer())
        .get(`/reservations/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not find reservation with id: fakeId`]);
          done();
        });
    });
  });

  describe('GET /reservations/users/:id', () => {
    it('should return correct reservations for given userId', (done) => {
      const givenId = '604bf99597d75d9420ec2e5d';
      request(app.getHttpServer())
        .get(`/reservations/users/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            id: '604bf99597d75d9420ec2e5d',
            bike_id: '604bf99597d75d9420ec2e5d',
            user_id: '604bf99597d75d9420ec2e5d',
            plannedDateFrom: '2021-03-14T00:00:00.000Z',
            plannedDateTo: '2021-03-14T00:00:00.000Z',
            rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
            rentalPointTo_id: '604bf99597d75d9420ec2e5d',
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const givenId = 'fakeId';
      request(app.getHttpServer())
        .get(`/reservations/users/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not find reservation for user_id: fakeId`]);
          done();
        });
    });
  });

  describe('GET /reservations/bikes/:id', () => {
    it('should return correct reservations for given userId', (done) => {
      const givenId = '604bf99597d75d9420ec2e5d';
      request(app.getHttpServer())
        .get(`/reservations/bikes/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            id: '604bf99597d75d9420ec2e5d',
            bike_id: '604bf99597d75d9420ec2e5d',
            user_id: '604bf99597d75d9420ec2e5d',
            plannedDateFrom: '2021-03-14T00:00:00.000Z',
            plannedDateTo: '2021-03-14T00:00:00.000Z',
            rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
            rentalPointTo_id: '604bf99597d75d9420ec2e5d',
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const givenId = 'fakeId';
      request(app.getHttpServer())
        .get(`/reservations/bikes/${givenId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not find reservation for bike_id: fakeId`]);
          done();
        });
    });
  });

  describe('PATCH /reservations/:id', () => {
    it('should return reservation with applied patch', (done) => {
      const givenId = createdReservationId;
      const givenDate = new Date('2021-03-14');
      request(app.getHttpServer())
        .patch(`/reservations/${givenId}`)
        .send(patchRentalPointFromRequest)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .then(async () => {
          const reservationsCount = await rentModel.countDocuments({}).exec();
          expect(reservationsCount).toEqual(2);
          const reservation = await rentModel.findOne({ _id: givenId }).exec();
          expect(reservation.bike_id).toEqual('604bf99597d75d9420ec2e5d');
          expect(reservation.user_id).toEqual('604bf99597d75d9420ec2e5d');
          expect(reservation.plannedDateFrom).toEqual(givenDate);
          expect(reservation.plannedDateTo).toEqual(givenDate);
          expect(reservation.rentalPointFrom_id).toEqual('604bf99597d75d9420ec2e5a');
          expect(reservation.rentalPointTo_id).toEqual('604bf99597d75d9420ec2e5d');
          expect(reservation.__v).toEqual(1);
          done();
        });
    });
    it('should return 400', async (done) => {
      const givenId = createdRentId;
      request(app.getHttpServer())
        .patch(`/reservations/${givenId}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          assert(res.body.message, [`Bike has been already picked up.`]);
          done();
        });
    });
  });

  describe('DELETE /reservations/:id', () => {
    it('should delete reservation with given ID', (done) => {
      const idToDelete = createdReservationId;
      request(app.getHttpServer())
        .delete(`/reservations/${idToDelete}`)
        .expect(HttpStatus.OK)
        .then(async () => {
          const remainingReservations = await rentModel.find({}).exec();
          expect(remainingReservations).toHaveLength(1);
          done();
        });
    });
    it('should return 404', async (done) => {
      const idToDelete = createdReservationId;
      await rentModel.deleteOne({ _id: idToDelete });
      request(app.getHttpServer())
        .delete(`/reservations/${idToDelete}`)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not delete reservation with id: ${idToDelete}`]);
          done();
        });
    });
    it('should return 400', async (done) => {
      const idToDelete = createdRentId;
      request(app.getHttpServer())
        .delete(`/reservations/${idToDelete}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          assert(res.body.message, [`Bike has been already picked up.`]);
          done();
        });
    });
  });
});
