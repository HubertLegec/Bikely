import { Post, Controller, UseGuards, Body, Get, Param, Delete } from '@nestjs/common';
import { addBikeToRentalPoint } from './addBikeToRentalPoint.dto';
import { RentalPointService } from './rental-points.service';
import { RentalPointRequest } from './rentalPointRequest.dto';
import { RolesEnum } from '../types/roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('/rentalpoints')
export class RentalPointController {
  constructor(private readonly rentalPointService: RentalPointService) {}

  @Get()
  async getAllRentalPoints() {
    const rentalPoints = await this.rentalPointService.getAll();
    return rentalPoints;
  }

  @Get(':id')
  async getRentalPoint(@Param('id') id: string) {
    return await this.rentalPointService.getRentalPointById(id);
  }

  @Post()
  async addRentalPoint(@Body() rentalPointRequest: RentalPointRequest) {
    const id = await this.rentalPointService.create(rentalPointRequest);
    return { id: id };
  }

  @Post(':id/bikes')
  async addBikeToRentalPoint(@Body() bike_id: addBikeToRentalPoint, @Param('id') id: string) {
    return await this.rentalPointService.addBikeToRentalPoint(bike_id.bike_id, id);
  }

  @Delete(':id')
  async deleteRentalPoint(@Param('id') rentalPointId: string) {
    await this.rentalPointService.deleteRentalPoint(rentalPointId);
  }
}
