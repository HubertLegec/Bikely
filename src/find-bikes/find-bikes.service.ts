import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bike } from 'src/bikes/bike.model';
import { BikeType } from 'src/bikes/bike.type';

@Injectable()
export class FindBikesService {
  constructor(@InjectModel('Bike') private readonly bikeModel: Model<Bike>) {}

  async findAll(): Promise<Bike[]> {
    return this.bikeModel.find().exec();
  }

  async findAllByType(type: BikeType): Promise<Bike[]> {
    return this.bikeModel.find({ type: type });
  }
}
