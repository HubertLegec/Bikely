import * as mongoose from 'mongoose';

export const RentalPointSchema = new mongoose.Schema(
  {
   bicycle_id: {type: [mongoose.Types.ObjectId]},
   location: {type: 'string'}
  },
  { optimisticConcurrency: true },
);

export interface RentalPoint extends mongoose.Document {
    bicycle_id: string[],
    location: string
}