import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bike } from 'src/bikes/bike.model';
import { BikeType } from 'src/bikes/bike.type';
import { RentalPoint } from 'src/rental-points/rental-point.model';
import { RentalPointService } from 'src/rental-points/rental-points.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { BikeResponse } from './BikeResponse';

@Injectable()
export class FindBikesService {
  constructor(
    @InjectModel('Bike') private readonly bikeModel: Model<Bike>,
    private readonly rentalPointService: RentalPointService,
    private readonly reservationService: ReservationsService,
  ) {}

  async findAll(): Promise<Bike[]> {
    return this.bikeModel.find().exec();
  }

  async findAllByType(type: BikeType): Promise<Bike[]> {
    return this.bikeModel.find({ type: type });
  }

  async getAllWithLocation(requestedDate) {
    const rentalPoints = await this.rentalPointService.getAll();
    const bikes = await this.findAll();
    const currentReservations = await this.reservationService.getAllReservations();
    const currentRents = await this.reservationService.getAllRents();
    const parsedRequestedDate = Date.parse(requestedDate);

    let response = [];

    //add all bikes from every rentalPoint
    rentalPoints.forEach(async (point) => {
      point.bicycle_id.forEach(async (id) => {
        const bike = bikes.find((bike) => bike._id == id.toString());
        const bikeResponse = this.convertToBikeResponse(bike, point);
        response.push(bikeResponse);
      });
    });

    //add all bikes already rented (removed from rental point) and not yet returned with plannedDateTo before query plannedDateFrom
    currentRents
      .filter((rent) => {
        return Date.parse(rent.plannedDateTo.toString()) < parsedRequestedDate;
      })
      .forEach(async (rent) => {
        const bike = bikes.find((bike) => bike._id.toString() === rent.id.toString());
        const rentalPoint = await this.rentalPointService.getRentalPointById(rent.rentalPointTo_id);
        const bikeResponse = this.convertToBikeResponse(bike, rentalPoint);

        response.push(bikeResponse);
      });

    //TODO
    //add all bikes from reservations where reservation plannedDateTo is less then query plannedDateFrom and get their reservation return location
    // console.log(currentReservations);
    const bikeIdsToRemove = currentReservations
      .filter((reservation) => {
        if (reservation.plannedDateTo) {
          return Date.parse(reservation.plannedDateTo.toString()) > parsedRequestedDate;
        }
      })
      .map((reservation) => {
        return reservation.bike_id;
      });

    //remove bikes where reservation plannedDateTo is later then query plannedDateFrom
    response = response.filter((el) => {
      return !bikeIdsToRemove.includes(el.bikeId.toString());
    });
    return response;
  }
  convertToBikeResponse(bike: Bike, point: RentalPoint): BikeResponse {
    const bikeResponse = {
      bikeId: bike._id,
      type: bike.type,
      isElectric: bike.isElectric,
      frameSize: bike.frameSize,
      rentalPoint: { id: point._id, location: point.location },
    };
    return bikeResponse;
  }
}
