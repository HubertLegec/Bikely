import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Bike } from './bike.model';
import { BikeRequest } from './bikeRequest.dto';
import { BikeUpdate } from './bikeUpdate.dto';

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

  async getBike(bikeId: string) {
    const bike = await this.findBike(bikeId);
    return bike;
  }

  async updateBike(bikeId: string, bikeUpdate: BikeUpdate) {
    const bike = await this.findBike(bikeId);
    if (bikeUpdate.type) {
      bike.type = bikeUpdate.type;
    }
    if (bikeUpdate.isElectric !== undefined) {
      bike.isElectric = bikeUpdate.isElectric;
    }
    if (bikeUpdate.frameSize) {
      bike.frameSize = bikeUpdate.frameSize;
    }
    bike.save();
  }

  async deleteBike(bikeId: string) {
    const deleteResult = await this.bikeModel.deleteOne({ _id: bikeId });
    if (deleteResult.n === 0) {
      throw new NotFoundException(`Could not delete bike with id: ${bikeId}`);
    }
  }

  async findBike(bikeId: string) {
    let bike: Bike;
    try {
      bike = await this.bikeModel.findById(bikeId);
    } catch (error) {
      throw new NotFoundException(`Could not find bike with id: ${bikeId}`);
    }
    return bike;
  }
}
