import { Post, Body, Controller } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikeRequest } from './bikeRequest.dto';

@Controller('/admin/bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  async addBike(@Body() bikeRequest: BikeRequest) {
    const id = await this.bikesService.create(bikeRequest);
    return { id: id };
  }
}
