import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationRequest } from './reservationRequest.dto';
import { ReservationUpdate } from './reservationUpdate.dto';

@Controller('/reservations')
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

  @Get('/rental_points/:id')
  async getReservationsForRentalPoint(@Param('id') rentalPointId: string) {
    return await this.reservationService.getReservationsForRentalPoint(rentalPointId);
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
