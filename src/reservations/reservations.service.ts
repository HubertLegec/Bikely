import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalPointService } from '../rental-points/rental-points.service';
import { Rent } from '../rent/rent.model';
import { ReservationRequest } from './reservationRequest.dto';
import { ReservationResponse } from './reservationResponse.dto';
import { ReservationUpdate } from './reservationUpdate.dto';
import { RentResponse } from '../rent/RentResponse';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel('Rent') private readonly rentModel: Model<Rent>,
    private readonly rentalPointService: RentalPointService,
  ) {}

  async getAllReservations() {
    const reservations = await this.rentModel.find({ actualDateFrom: undefined }).exec();
    return reservations.map((reservation) => {
      return this.convertToReservationResponse(reservation);
    });
  }

  async getAllRents() {
    const rents = await this.rentModel.find().where('actualDateFrom').ne(undefined).exec();
    return rents.map((rent) => {
      return this.convertToRentResponse(rent);
    });
  }

  async getPresentRents() {
    const rents = await this.rentModel.find({ actualDateTo: undefined }).where('actualDateFrom').ne(undefined).exec();
    return rents.map((rent) => {
      return this.convertToRentResponse(rent);
    });
  }

  async getReservation(reservationId: string) {
    const reservation = await this.findReservation(reservationId);
    if (reservation && reservation.actualDateFrom) {
      throw new BadRequestException(`Bike has been already picked up.`);
    }
    return this.convertToReservationResponse(reservation);
  }

  async getReservationsByBikeId(bikeId: string) {
    const reservations = await this.rentModel.find({ bike_id: bikeId, actualDateFrom: undefined }).exec();
    if (reservations.length === 0) {
      throw new NotFoundException(`Could not find reservation for bike_id: ${bikeId}`);
    }
    return reservations.map((reservation) => {
      return this.convertToReservationResponse(reservation);
    });
  }

  async getReservationsByUserId(userId: string) {
    const reservations = await this.rentModel.find({ user_id: userId, actualDateFrom: undefined }).exec();
    if (reservations.length === 0) {
      throw new NotFoundException(`Could not find reservation for user_id: ${userId}`);
    }
    return reservations.map((reservation) => {
      return this.convertToReservationResponse(reservation);
    });
  }

  async deleteReservation(reservationId: string) {
    const reservation = await this.findReservation(reservationId);
    if (reservation && reservation.actualDateFrom) {
      throw new BadRequestException(`Bike has been already picked up.`);
    }
    const deleteResult = await this.rentModel.deleteOne({ _id: reservationId });
    if (deleteResult.n === 0) {
      throw new NotFoundException(`Could not delete reservation with id: ${reservationId}`);
    }
  }

  async updateReservation(reservationId: string, reservationUpdate: ReservationUpdate) {
    const reservation = await this.findReservation(reservationId);
    if (reservation && reservation.actualDateFrom) {
      throw new BadRequestException(`Bike has been already picked up.`);
    }
    if (reservationUpdate.bike_id) {
      reservation.bike_id = reservationUpdate.bike_id;
    }
    if (reservationUpdate.plannedDateFrom) {
      reservation.plannedDateFrom = reservationUpdate.plannedDateFrom;
    }
    if (reservationUpdate.plannedDateTo) {
      reservation.plannedDateTo = reservationUpdate.plannedDateTo;
    }
    if (reservationUpdate.rentalPointFrom_id) {
      reservation.rentalPointFrom_id = reservationUpdate.rentalPointFrom_id;
    }
    if (reservationUpdate.rentalPointTo_id) {
      reservation.rentalPointTo_id = reservationUpdate.rentalPointTo_id;
    }
    reservation.save();
  }

  async create(reservationRequest: ReservationRequest, userId) {
    const newReservation = new this.rentModel({
      bike_id: reservationRequest.bike_id,
      user_id: userId,
      plannedDateFrom: reservationRequest.plannedDateFrom,
      plannedDateTo: reservationRequest.plannedDateTo,
      rentalPointFrom_id: reservationRequest.rentalPointFrom_id,
      rentalPointTo_id: reservationRequest.rentalPointTo_id,
    });
    const result = await newReservation.save();
    return result.id;
  }

  async findReservation(reservationId: string) {
    let reservation: Rent;
    try {
      reservation = await this.rentModel.findById(reservationId).exec();
    } catch (error) {
      throw new NotFoundException(`Could not find reservation with id: ${reservationId}`);
    }
    return reservation;
  }

  async rentBike(reservationId: string): Promise<Rent | null> {
    const reservation = await this.findReservation(reservationId);
    if (reservation) {
      this.rentalPointService.removeBikeFromRentalPoint(reservation.bike_id, reservation.rentalPointFrom_id);
      reservation.actualDateFrom = new Date();
      await reservation.save();
      return reservation;
    } else return null;
  }

  async returnBike(reservationId: string, rentalPointTo_id: string): Promise<Rent | null> {
    const reservation = await this.findReservation(reservationId);
    const rentalPoint = await this.rentalPointService.getRentalPointById(rentalPointTo_id);
    if (reservation && rentalPoint) {
      this.rentalPointService.addBikeToRentalPoint(reservation.bike_id, rentalPointTo_id);
      reservation.rentalPointTo_id = rentalPointTo_id;
      reservation.actualDateTo = new Date();
      await reservation.save();
      return reservation;
    } else return null;
  }

  convertToReservationResponse(reservation: Rent): ReservationResponse {
    const reservationResponse = {
      id: reservation._id,
      bike_id: reservation.bike_id,
      user_id: reservation.user_id,
      plannedDateFrom: reservation.plannedDateFrom,
      plannedDateTo: reservation.plannedDateTo,
      rentalPointFrom_id: reservation.rentalPointFrom_id,
      rentalPointTo_id: reservation.rentalPointTo_id,
    };
    return reservationResponse;
  }
  convertToRentResponse(rent: Rent): RentResponse {
    const rentResponse = {
      id: rent._id,
      bike_id: rent.bike_id,
      user_id: rent.user_id,
      plannedDateFrom: rent.plannedDateFrom,
      plannedDateTo: rent.plannedDateTo,
      actualDateFrom: rent.actualDateFrom,
      actualDateTo: rent.actualDateTo,
      rentalPointFrom_id: rent.rentalPointFrom_id,
      rentalPointTo_id: rent.rentalPointTo_id,
    };
    return rentResponse;
  }
}
