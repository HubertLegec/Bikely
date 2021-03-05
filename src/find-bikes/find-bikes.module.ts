import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BikeSchema } from 'src/bikes/bike.model';
import { FindBikesController } from './find-bikes.controller';
import { FindBikesService } from './find-bikes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Bike', schema: BikeSchema }])],
  controllers: [FindBikesController],
  providers: [FindBikesService]
})
export class FindBikesModule {}
