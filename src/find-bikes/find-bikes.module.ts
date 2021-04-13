import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalPointModule } from 'src/rental-points/rental-point.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { BikeSchema } from '../bikes/bike.model';
import { FindBikesController } from './find-bikes.controller';
import { FindBikesService } from './find-bikes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Bike', schema: BikeSchema }]), ReservationsModule, RentalPointModule],
  controllers: [FindBikesController],
  providers: [FindBikesService],
})
export class FindBikesModule {}
