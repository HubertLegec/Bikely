import { Controller, Get, Param } from '@nestjs/common';
import { Bike } from 'src/bikes/bike.model';
import { FindBikesService } from './find-bikes.service';

@Controller('/bikes')
export class FindBikesController {
  constructor(private readonly findBikesService: FindBikesService) {}

  @Get()
  async findAll() {
    return await this.findBikesService.findAll();
  }

  @Get('/:type')
  async findAllByType(@Param() params): Promise<Bike[]> {
    return await this.findBikesService.findAllByType(params.type);
  }
}
