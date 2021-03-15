import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalPointSchema } from './rental-point.model';
import { RentalPointService } from './rental-points.service';
import { RentalPointController } from './rentalPoint.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'RentalPoint', schema: RentalPointSchema }])],
  controllers: [RentalPointController],
  providers: [RentalPointService],
  exports: [RentalPointService],
})
export class RentalPointModule {}