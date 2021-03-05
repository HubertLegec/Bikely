import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Bike } from './bike.model';
import { BikeRequest } from './bikeRequest.dto';

@Injectable()
export class BikesService {
  constructor(@InjectModel('Bike') private readonly bikeModel: Model<Bike>) {}

  async create(bikeRequest: BikeRequest) {
    const newBike = new this.bikeModel({
      type: bikeRequest.type,
      isElectric: bikeRequest.isElectric,
      frameSize: bikeRequest.frameSize,
    });
    const result = await newBike.save();
    return result.id;
  }
  
  // async findAll(): Promise<Bike[]> {
  //   return this.bikeModel.find().exec();
  // };

  // async findAllByType(type:BikeType): Promise<Bike[]> {
  //   return this.bikeModel.find({'type': type})
  // };

}
