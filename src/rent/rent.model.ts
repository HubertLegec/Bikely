import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const RentSchema = new mongoose.Schema(
  {
    bike_id: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plannedDateFrom: { type: Date, required: true },
    plannedDateTo: { type: Date, required: true },
    actualDateFrom: { type: Date },
    actualDateTo: { type: Date },
    rentalPointFrom_id: { type: Schema.Types.ObjectId, ref: 'RentalPoint', required: true },
    rentalPointTo_id: { type: Schema.Types.ObjectId, ref: 'RentalPoint', required: true },
  },
  { optimisticConcurrency: true },
);

export interface Rent extends mongoose.Document {
  id: string;
  bike_id: string;
  user_id: string;
  plannedDateFrom: Date;
  plannedDateTo: Date;
  actualDateFrom: Date;
  actualDateTo: Date;
  rentalPointFrom_id: string;
  rentalPointTo_id: string;
}
