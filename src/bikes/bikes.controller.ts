import { Post, Controller, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikeRequest } from './bikeRequest.dto';
import { BikeUpdate } from './bikeUpdate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/types/roles';

@Controller('/admin/bikes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  @Roles(RolesEnum.Admin)
  async addBike(@Body() bikeRequest: BikeRequest) {
    const id = await this.bikesService.create(bikeRequest);
    return { id: id };
  }

  @Get(':id')
  @Roles(RolesEnum.Admin)
  async getBike(@Param('id') bikeId: string) {
    return await this.bikesService.getBike(bikeId);
  }

  @Patch(':id')
  @Roles(RolesEnum.Admin)
  async updateBike(@Param('id') bikeId: string, @Body() bikeUpdate: BikeUpdate) {
    await this.bikesService.updateBike(bikeId, bikeUpdate);
  }

  @Delete(':id')
  @Roles(RolesEnum.Admin)
  async deleteBike(@Param('id') bikeId: string) {
    await this.bikesService.deleteBike(bikeId);
  }
}
