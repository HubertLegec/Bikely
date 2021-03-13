import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RentSchema } from './rent.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rent', schema: RentSchema }])],
  providers: [RentService],
  controllers: [RentController],
})
export class RentModule {}
