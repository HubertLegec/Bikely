import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BikesModule } from './bikes/bikes.module';
import { FindBikesModule } from './find-bikes/find-bikes.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RentalPointModule } from './rental-points/rental-point.module';


@Module({
  imports: [
    BikesModule,
    RentalPointModule,
    // MongooseModule.forRoot('mongodb+srv://test:test@cluster0.tnyju.mongodb.net/bikely?retryWrites=true&w=majority'),
    FindBikesModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_CLUSTER}.d5zkf.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    ),
    AuthModule,
    UsersModule,
    ReservationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
