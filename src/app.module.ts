import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BikesModule } from './bikes/bikes.module';

@Module({
  imports: [
    BikesModule,
    MongooseModule.forRoot(
      'mongodb+srv://test:test@cluster0.tnyju.mongodb.net/bikely?retryWrites=true&w=majority',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
