import * as mongoose from 'mongoose';

export const BikeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  isFree: { type: Boolean, required: true },
});

export interface Bike {
  id: string;
  type: string;
  isFree: boolean;
}
