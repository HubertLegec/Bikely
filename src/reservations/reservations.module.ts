import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentSchema } from '../rent/rent.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rent', schema: RentSchema }])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
