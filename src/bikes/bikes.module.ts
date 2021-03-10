import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BikeSchema } from './bike.model';
import { BikesController } from './bikes.controller';
import { BikesService } from './bikes.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Bike', schema: BikeSchema }])],
  controllers: [BikesController],
  providers: [BikesService],
})
export class BikesModule {}
