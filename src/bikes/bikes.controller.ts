import { Post, Body, Get, Controller, Param } from '@nestjs/common';
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

  // @Get()
  // async findAll() {
  //   const allBikes = await this.bikesService.findAll();
  //   return allBikes;
  // };

  // @Get('/:type') 
  // async findAllByType(@Param() params): Promise<Bike[]> {
  //   const allBikesByType = await this.bikesService.findAllByType(params.type);
  //   return allBikesByType;
  // };
}
