import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { Bike } from 'src/bikes/bike.model';
import { FindBikesService } from './find-bikes.service';
import { RolesEnum } from '../types/roles';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('/bikes')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class FindBikesController {
  constructor(private readonly findBikesService: FindBikesService) {}

  @Get()
  // @Roles(RolesEnum.Admin, RolesEnum.User)
  async findAll() {
    return await this.findBikesService.getAllWithLocation();
  }

  @Get('/:type')
  async findAllByType(@Param() params): Promise<Bike[]> {
    return await this.findBikesService.findAllByType(params.type);
  }
}
