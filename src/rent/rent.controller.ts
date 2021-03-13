import { Body, Controller, Post } from '@nestjs/common';
import { RentService } from './rent.service';
import { ReservationRequest } from './reservationRequest.dto';

@Controller('/reservations')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  async createReservation(@Body() reservationRequest: ReservationRequest) {
    const id = await this.rentService.create(reservationRequest);
    return { id: id };
  }
}
