import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rent } from '../rent/rent.model';
import { ReservationRequest } from './reservationRequest.dto';
import { ReservationUpdate } from './reservationUpdate.dto';

@Injectable()
export class ReservationsService {
  constructor(@InjectModel('Rent') private readonly rentModel: Model<Rent>) {}

  async getAllReservations() {
    return await this.rentModel.find().exec();
  }

  async getReservation(reservationId: string) {
    return await this.findReservation(reservationId);
  }

  async getReservationsByBikeId(bikeId: string) {
    return await this.rentModel.find({ bike_id: bikeId }).exec();
  }

  async getReservationsByUserId(userId: string) {
    return await this.rentModel.find({ user_id: userId }).exec();
  }

  async deleteReservation(reservationId: string) {
    const reservation = await this.findReservation(reservationId);
    if (reservation.actualDateFrom !== null) {
      throw new BadRequestException(`Bike has been already picked up.`);
    }
    const deleteResult = await this.rentModel.deleteOne({ _id: reservationId });
    if (deleteResult.n === 0) {
      throw new NotFoundException(`Could not delete reservation with id: ${reservationId}`);
    }
  }

  async updateReservation(reservationId: string, reservationUpdate: ReservationUpdate) {
    const reservation = await this.findReservation(reservationId);
    if (reservation.actualDateFrom !== null) {
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

  async create(reservationRequest: ReservationRequest) {
    const newReservation = new this.rentModel({
      bike_id: reservationRequest.bike_id,
      user_id: reservationRequest.user_id,
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
}
