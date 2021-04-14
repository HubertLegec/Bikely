import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationRequest } from './reservationRequest.dto';
import { ReservationUpdate } from './reservationUpdate.dto';
import { RolesEnum } from '../types/roles';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Post()
  @Roles(RolesEnum.User)
  async createReservation(@Req() req, @Body() reservationRequest: ReservationRequest) {
    const userId = req.user.id;
    const id = await this.reservationService.create(reservationRequest, userId);
    return { id: id };
  }

  @Get('/users')
  @Roles(RolesEnum.User, RolesEnum.Admin)
  async getReservationByUserId(@Req() req) {
    const userId = req.user.id;
    return await this.reservationService.getReservationsByUserId(userId);
  }

  @Get(':id')
  @Roles(RolesEnum.Admin)
  async getReservation(@Param('id') reservationId: string) {
    return await this.reservationService.getReservation(reservationId);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  async getAllReservations() {
    return await this.reservationService.getAllReservations();
  }

  @Get('/bikes/:id')
  @Roles(RolesEnum.Admin)
  async getReservationByBikeId(@Param('id') bikeId: string) {
    const reservation = await this.reservationService.getReservationsByBikeId(bikeId);
    if (reservation) return reservation;
    throw new NotFoundException('Reservation with given ID was not found');
  }

  @Patch(':id')
  @Roles(RolesEnum.User)
  async updateReservation(@Param('id') reservationId: string, @Body() reservationUpdate: ReservationUpdate) {
    await this.reservationService.updateReservation(reservationId, reservationUpdate);
  }

  @Delete(':id')
  @Roles(RolesEnum.User)
  async deleteReservation(@Param('id') reservationId: string) {
    await this.reservationService.deleteReservation(reservationId);
  }

  @Get('/rental_points/:id')
  async getReservationsForRentalPoint(@Param('id') rentalPointId: string) {
    return await this.reservationService.getReservationsForRentalPoint(rentalPointId);
  }

  @Put('/rent/:id')
  @Roles(RolesEnum.Admin)
  async rentBikeEvent(@Param('id') reservationId: string) {
    const reservation = await this.reservationService.rentBike(reservationId);
    if (!reservation) throw new NotFoundException('Reservation with given id does not exist');
    return reservation.toObject();
  }

  @Put('/return/:id')
  @Roles(RolesEnum.Admin)
  async returnBikeEvent(@Param('id') reservationId: string) {
    const reservation = await this.reservationService.returnBike(reservationId);
    if (!reservation) throw new NotFoundException('Reservation with given id does not exist');
    return reservation.toObject();
  }
}
