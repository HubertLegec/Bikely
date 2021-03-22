import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bike } from 'src/bikes/bike.model';
import { BikeType } from 'src/bikes/bike.type';
import { RentalPointService } from 'src/rental-points/rental-points.service';
import { ReservationsService } from 'src/reservations/reservations.service';

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

  async getAllWithLocation() {
    const rentalPoints = await this.rentalPointService.getAll();
    const bikes = await this.findAll();
    // const reservations = await this.reservationService.getAllReservations();
    const response = [];

    await rentalPoints.forEach(async (point) => {
      point.bicycle_id.forEach(async (id) => {
        const bike = bikes.find((bike) => bike._id == id.toString());
        const bikeResponse = {
          bikeId: bike._id,
          type: bike.type,
          isElectric: bike.isElectric,
          frameSize: bike.frameSize,
          rentalPoint: { id: point._id, location: point.location },
        };
        response.push(bikeResponse);
      });
    });
    return response;
  }
}
