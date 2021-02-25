import * as mongoose from 'mongoose';
import { BikeType } from './bike.type';

export const BikeSchema = new mongoose.Schema({
  type: { type: BikeType, required: true },
  isElectric: { type: Boolean, required: true },
  frameSize: { type: Number, required: true },
});

export interface Bike extends mongoose.Document {
  id: string;
  type: BikeType;
  isElectric: boolean;
  frameSize: number;
}
