import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// import { BikeUpdate } from './bikeUpdate.dto';
import { RentalPoint } from './rental-point.model';
import { RentalPointRequest } from './rentalPointRequest.dto';

@Injectable()
export class RentalPointService {
  constructor(@InjectModel('RentalPoint') private readonly rentalPointModel: Model<RentalPoint>) {}

  async create(rentalPointRequest: RentalPointRequest) {
      const newRentalPoint = new this.rentalPointModel({
          location: 'Karpacz',
      });
      const result = await newRentalPoint.save();
      return result.id;
    // const newBike = new this.bikeModel({
    //   type: bikeRequest.type,
    //   isElectric: bikeRequest.isElectric,
    //   frameSize: bikeRequest.frameSize,
    // });
    // const result = await newBike.save();
    // return result.id;
  }

  async getAll(): Promise<RentalPoint[]> {
    return this.rentalPointModel.find().exec();
  }

  async getRentalPointById(id: string): Promise<RentalPoint> {
    return this.rentalPointModel.findById({ _id: id });
  }

  async addBikeToRentalPoint(bike_id: string, rentalPoint_id: string): Promise<RentalPoint> {
    const rentalPoint = await this.rentalPointModel.findById(rentalPoint_id);
    rentalPoint.bicycle_id.push(bike_id);
    rentalPoint.save();
    return rentalPoint;
}

async deleteRentalPoint(rentalPoint_id: string) {
    const deleteRentalPointResult = await this.rentalPointModel.deleteOne({ _id: rentalPoint_id });
    if (deleteRentalPointResult.n === 0) {
      throw new NotFoundException(`Could not delete rental point with id: ${rentalPoint_id}`);
    }
}



//   async update(rentalPointId: string, bikeUpdate: BikeUpdate) {
//     // const bike = await this.findBike(bikeId);
//     // if (bikeUpdate.type) {
//     //   bike.type = bikeUpdate.type;
//     // }
//     // if (bikeUpdate.isElectric !== undefined) {
//     //   bike.isElectric = bikeUpdate.isElectric;
//     // }
//     // if (bikeUpdate.frameSize) {
//     //   bike.frameSize = bikeUpdate.frameSize;
//     // }
//     // bike.save();
//   }

//   async deleteBike(bikeId: string) {
//     // const deleteResult = await this.bikeModel.deleteOne({ _id: bikeId });
//     // if (deleteResult.n === 0) {
//     //   throw new NotFoundException(`Could not delete bike with id: ${bikeId}`);
//     // }
//   }

//   async findBike(bikeId: string) {
//     // let bike: Bike;
//     // try {
//     //   bike = await this.bikeModel.findById(bikeId);
//     // } catch (error) {
//     //   throw new NotFoundException(`Could not find bike with id: ${bikeId}`);
//     // }
//     // return bike;
//   }
}
