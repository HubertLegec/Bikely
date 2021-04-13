import { BikeType } from 'src/bikes/bike.type';

export class BikeResponse {
  bikeId: string;
  type: BikeType;
  isElectric: boolean;
  frameSize: number;
  rentalPoint: { id: string; location: string };
}
