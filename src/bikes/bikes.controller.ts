import { Post, Controller, Body } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikeRequest } from './bikeRequest.dto';

@Controller('/admin/bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  async addBike(@Body() bikeRequest: BikeRequest) {
    return this.bikesService.create(bikeRequest);
  }
}
