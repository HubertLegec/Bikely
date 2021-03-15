import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationRequest } from './reservationRequest.dto';
import { ReservationUpdate } from './reservationUpdate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Post()
  async createReservation(@Body() reservationRequest: ReservationRequest) {
    const id = await this.reservationService.create(reservationRequest);
    return { id: id };
  }

  @Get(':id')
  async getReservation(@Param('id') reservationId: string) {
    return await this.reservationService.getReservation(reservationId);
  }

  @Get()
  async getAllReservations() {
    return await this.reservationService.getAllReservations();
  }

  @Get('/users/:id')
  async getReservationByUserId(@Param('id') userId: string) {
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
}
