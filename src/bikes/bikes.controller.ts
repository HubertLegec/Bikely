import { Post, Controller, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikeRequest } from './bikeRequest.dto';
import { BikeUpdate } from './bikeUpdate.dto';

@Controller('/admin/bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  async addBike(@Body() bikeRequest: BikeRequest) {
    const id = await this.bikesService.create(bikeRequest);
    return { id: id };
  }

  @Get(':id')
  async getBike(@Param('id') bikeId: string) {
    return await this.bikesService.getBike(bikeId);
  }

  @Patch(':id')
  async updateBike(@Param('id') bikeId: string, @Body() bikeUpdate: BikeUpdate) {
    await this.bikesService.updateBike(bikeId, bikeUpdate);
  }

  @Delete(':id')
  async deleteBike(@Param('id') bikeId: string){
    await this.bikesService.deleteBike(bikeId);
  }
}
