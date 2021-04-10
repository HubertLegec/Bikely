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
  async createReservation(@Req() request, @Body() reservationRequest: ReservationRequest) {
    const userId = request.user.id;
    const id = await this.reservationService.create(reservationRequest, userId);
    return { id: id };
  }

  @Get(':id')
  async getReservation(@Param('id') reservationId: string) {
    return await this.reservationService.getReservation(reservationId);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  async getAllReservations() {
    return await this.reservationService.getAllReservations();
  }

  @Get('/users')
  @Roles(RolesEnum.Admin, RolesEnum.User)
  async getReservationByUserId(@Req() request) {
    const userId = request.user.id;
    return await this.reservationService.getReservationsByUserId(userId);
  }

  @Get('/bikes/:id')
  async getReservationByBikeId(@Param('id') bikeId: string) {
    return await this.reservationService.getReservationsByBikeId(bikeId);
  }

  @Patch(':id')
  async updateReservation(@Param('id') reservationId: string, @Body() reservationUpdate: ReservationUpdate) {
    await this.reservationService.updateReservation(reservationId, reservationUpdate);
  }

  @Delete(':id')
  async deleteReservation(@Param('id') reservationId: string) {
    await this.reservationService.deleteReservation(reservationId);
  }

  @Put('/rent/:id')
  async rentBikeEvent(@Param('id') reservationId: string) {
    const reservation = await this.reservationService.rentBike(reservationId);
    if (!reservation) throw new NotFoundException('Reservation with given id does not exist');
    return reservation.toObject();
  }

  @Put('/return/:id')
  async returnBikeEvent(@Param('id') reservationId: string) {
    const reservation = await this.reservationService.returnBike(reservationId);
    if (!reservation) throw new NotFoundException('Reservation with given id does not exist');
    return reservation.toObject();
  }
}
