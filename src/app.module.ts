import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BikesModule } from './bikes/bikes.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    BikesModule,
    MongooseModule.forRoot('mongodb+srv://test:test@cluster0.tnyju.mongodb.net/bikely?retryWrites=true&w=majority'),
    RentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
