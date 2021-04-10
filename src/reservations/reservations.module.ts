import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentSchema } from '../rent/rent.model';
import { RentalPointModule } from '../rental-points/rental-point.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rent', schema: RentSchema }]), RentalPointModule],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
