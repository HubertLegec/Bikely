import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import { Bike } from './bike.model';
import { BikeRequest } from './bikeRequest.dto';

@Injectable()
export class BikesService {
  constructor(
    @InjectModel('Bike') private readonly bikeModel: Model<Bike & Document>,
  ) {}

  async create(bikeRequest: BikeRequest) {
    const newBike = new this.bikeModel({
      type: bikeRequest.type,
      isFree: true,
    });
    const result = await newBike.save();
    console.log(result);
    return result.id;
  }
}
