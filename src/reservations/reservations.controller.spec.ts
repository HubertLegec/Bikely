import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Rent } from '../rent/rent.model';
import { testModuleWithInMemoryDb, validJWTToken } from '../utils/test-utils';
import { ReservationsModule } from './reservations.module';
import { assert } from 'console';
import { RentalPointModule } from '../rental-points/rental-point.module';
import { RentalPoint } from '../rental-points/rental-point.model';
import { RolesEnum } from '../../src/types/roles';
import { MockJWTStrategy } from '../utils/mock-auth';
import { UsersModule } from '../users/users.module';
import { BikesModule } from '../bikes/bikes.module';

const reservationRequestCorrect = {
  bike_id: '604bf99597d75d9420ec2e5d',
  user_id: '604fa1f255eeb15b4ca5cb62',
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

const loggedUser = {
  id: '604fa1f255eeb15b4ca5cb62',
  email: 'test@test.com',
  password: 'somePassword',
  role: RolesEnum.User,
};
const loggedUser2 = {
  id: '60591594075a0720e01df154',
  email: 'test@test.com',
  password: 'somePassword',
  role: RolesEnum.User,
};

const loggedAdmin = {
  id: '60737b37f3a17f496cabd8bd',
  email: 'admin@test.com',
  password: 'somePassword',
  role: RolesEnum.Admin,
};

const patchRentalPointFromRequest = {
  rentalPointFrom_id: '604bf99597d75d9420ec2e5a',
};

const rentalPointMockData = {
  location: 'some location',
  bicycle_id: ['604bf99597d75d9420ec2e5d', '604bf99597d75d9420ec2e5a'],
};

let rentalPointMock: RentalPoint;

describe('ReservationsController', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let rentModel: Model<Rent>;
  let createdReservationId: string;
  let createdRentId: string;
  let rentalPointModel: Model<RentalPoint>;

  beforeAll(async () => {
    const moduleWithDb = await testModuleWithInMemoryDb({
      imports: [RentalPointModule, ReservationsModule, UsersModule, BikesModule],
      providers: [MockJWTStrategy],
    });

    const module = moduleWithDb.module;
    mongoServer = moduleWithDb.mongoServer;

    rentModel = module.get('RentModel');
    rentalPointModel = module.get('RentalPointModel');
    rentalPointMock = await rentalPointModel.create(rentalPointMockData);
    reservationRequestCorrect.rentalPointTo_id = rentalPointMock._id;
    reservationRequestCorrect.rentalPointFrom_id = rentalPointMock._id;
    patchRentalPointFromRequest.rentalPointFrom_id = rentalPointMock._id;
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
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(reservationRequestCorrect)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED, done);
    });

    it(`Should return HttpStatus.BAD_REQUEST`, (done) => {
      request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
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
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            id: createdReservationId,
            bike_id: '604bf99597d75d9420ec2e5d',
            user_id: '604fa1f255eeb15b4ca5cb62',
            plannedDateFrom: '2021-03-14T00:00:00.000Z',
            plannedDateTo: '2021-03-14T00:00:00.000Z',
            rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
            rentalPointTo_id: '604bf99597d75d9420ec2e5d',
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const notExistingId = '60737b53f3a17f496cabd8bf';
      request(app.getHttpServer())
        .get(`/reservations/${notExistingId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          assert(res.body.message, [`Could not find reservation with id: fakeId`]);
          done();
        });
    });
  });

  describe('GET /reservations/users', () => {
    it('should return correct reservations for logged user', (done) => {
      request(app.getHttpServer())
        .get(`/reservations/users/`)
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            id: '604bf99597d75d9420ec2e5d',
            bike_id: '604bf99597d75d9420ec2e5d',
            user_id: reservationRequestCorrect.user_id,
            plannedDateFrom: '2021-03-14T00:00:00.000Z',
            plannedDateTo: '2021-03-14T00:00:00.000Z',
            rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
            rentalPointTo_id: '604bf99597d75d9420ec2e5d',
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const notExistingId = '60737b53f3a17f496cabd8bf';
      request(app.getHttpServer())
        .get(`/reservations/users/${notExistingId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedUser2)}`)
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
    it('should return correct reservations for given bikeId', (done) => {
      const givenId = '604bf99597d75d9420ec2e5d';
      request(app.getHttpServer())
        .get(`/reservations/bikes/${givenId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          assert(res.body, {
            id: '604bf99597d75d9420ec2e5d',
            bike_id: '604bf99597d75d9420ec2e5d',
            user_id: '1234567891234567891234',
            plannedDateFrom: '2021-03-14T00:00:00.000Z',
            plannedDateTo: '2021-03-14T00:00:00.000Z',
            rentalPointFrom_id: '604bf99597d75d9420ec2e5d',
            rentalPointTo_id: '604bf99597d75d9420ec2e5d',
          });
          done();
        });
    });
    it('should return 404', (done) => {
      const notExistingId = '60737b53f3a17f496cabd8bf';
      request(app.getHttpServer())
        .get(`/reservations/bikes/${notExistingId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
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
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .send(patchRentalPointFromRequest)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .then(async () => {
          const reservationsCount = await rentModel.countDocuments({}).exec();
          expect(reservationsCount).toEqual(2);
          const reservation = await rentModel.findOne({ _id: givenId }).exec();
          expect(reservation.bike_id.toString()).toEqual('604bf99597d75d9420ec2e5d');
          expect(reservation.user_id.toString()).toEqual(reservationRequestCorrect.user_id);
          expect(reservation.plannedDateFrom).toEqual(givenDate);
          expect(reservation.plannedDateTo).toEqual(givenDate);
          expect(reservation.rentalPointFrom_id.toString()).toEqual(rentalPointMock._id.toString());
          expect(reservation.rentalPointTo_id.toString()).toEqual(rentalPointMock._id.toString());
          done();
        });
    });
    it('should return 400', async (done) => {
      const givenId = createdRentId;
      request(app.getHttpServer())
        .patch(`/reservations/${givenId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
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
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
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
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
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
        .set('Authorization', `Bearer ${validJWTToken(loggedUser)}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          assert(res.body.message, [`Bike has been already picked up.`]);
          done();
        });
    });
  });

  describe('PUT /reservation/rent/:id', () => {
    it('Should update reservation', (done) => {
      reservationRequestCorrect.rentalPointFrom_id = rentalPointMock.id;
      request(app.getHttpServer())
        .put(`/reservations/rent/${createdReservationId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .then(async (response) => {
          expect(response.body.actualDateFrom).toBeTruthy();
          rentalPointMock = await rentalPointModel.findById(rentalPointMock.id);
          expect(rentalPointMock.bicycle_id.length).toBe(2);
          done();
        });
    });

    it('Should return NOT_Found if reservation does not exists', (done) => {
      request(app.getHttpServer())
        .put(`/reservations/rent/notExistingId123456789`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.NOT_FOUND, done);
    });
  });

  describe('PUT /reservation/return/:id', () => {
    it('Should update reservation', (done) => {
      request(app.getHttpServer())
        .put(`/reservations/return/${createdReservationId}`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .then(async (response) => {
          expect(response.body.actualDateTo).toBeTruthy();
          rentalPointMock = await rentalPointModel.findById(rentalPointMock.id);
          expect(rentalPointMock.bicycle_id.length).toBe(3);
          done();
        });
    });

    it('Should return NOT_Found if reservation does not exists', (done) => {
      request(app.getHttpServer())
        .put(`/reservations/return/notExistingId123456789`)
        .set('Authorization', `Bearer ${validJWTToken(loggedAdmin)}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.NOT_FOUND, done);
    });
  });
});
