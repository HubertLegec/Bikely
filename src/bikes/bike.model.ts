import * as mongoose from 'mongoose';

export const BikeSchema = new mongoose.Schema({
  type: { type: String, required: true },
});

export interface Bike {
  id: string;
  type: string;
}
