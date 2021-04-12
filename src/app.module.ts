import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BikesModule } from './bikes/bikes.module';
import { FindBikesModule } from './find-bikes/find-bikes.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RentalPointModule } from './rental-points/rental-point.module';

const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_CLUSTER, DATABASE_NAME } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
    ),
    UsersModule,
    AuthModule,
    ReservationsModule,
    BikesModule,
    RentalPointModule,
    FindBikesModule,
  ],
})
export class AppModule {}
