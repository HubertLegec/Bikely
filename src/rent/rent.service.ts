import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rent } from './rent.model';
import { ReservationRequest } from './reservationRequest.dto';

@Injectable()
export class RentService {
  constructor(@InjectModel('Rent') private readonly rentModel: Model<Rent>) {}

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
}
