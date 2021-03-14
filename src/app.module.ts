import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BikesModule } from './bikes/bikes.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    BikesModule,
    MongooseModule.forRoot('mongodb+srv://test:test@cluster0.tnyju.mongodb.net/bikely?retryWrites=true&w=majority'),
    ReservationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
