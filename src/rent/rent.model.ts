import * as mongoose from 'mongoose';

export const RentSchema = new mongoose.Schema(
  {
    bike_id: { type: String, required: true },
    user_id: { type: String, required: true },
    plannedDateFrom: { type: Date, required: true },
    plannedDateTo: { type: Date, required: true },
    actualDateFrom: { type: Date },
    actualDateTo: { type: Date },
    rentalPointFrom_id: { type: String, required: true },
    rentalPointTo_id: { type: String, required: true },
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
