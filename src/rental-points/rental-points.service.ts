import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RentalPoint } from './rental-point.model';
import { RentalPointRequest } from './rentalPointRequest.dto';

@Injectable()
export class RentalPointService {
  constructor(@InjectModel('RentalPoint') private readonly rentalPointModel: Model<RentalPoint>) {}

  async create(rentalPointRequest: RentalPointRequest) {
    const newRentalPoint = new this.rentalPointModel({
      location: rentalPointRequest.location,
      bicycle_id: rentalPointRequest.bicycle_id,
    });
    const result = await newRentalPoint.save();
    return result.id;
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

  async removeBikeFromRentalPoint(bikeId: string, rentalPointId: string): Promise<RentalPoint | null> {
    const rentalPoint = await this.rentalPointModel.findById(rentalPointId);
    if (rentalPoint) {
      rentalPoint.bicycle_id = rentalPoint.bicycle_id.filter((id) => id != bikeId);
      await rentalPoint.save();
      return rentalPoint;
    } else return null;
  }

  async deleteRentalPoint(rentalPoint_id: string) {
    const deleteRentalPointResult = await this.rentalPointModel.deleteOne({ _id: rentalPoint_id });
    if (deleteRentalPointResult.n === 0) {
      throw new NotFoundException(`Could not delete rental point with id: ${rentalPoint_id}`);
    }
  }
}
