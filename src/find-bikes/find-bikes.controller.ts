import { Controller, Get, Param } from '@nestjs/common';
import { Bike } from 'src/bikes/bike.model';
import { FindBikesService } from './find-bikes.service';

@Controller('/bikes')
export class FindBikesController {
    constructor(private readonly findBikesService: FindBikesService) {}

    @Get()
    async findAll() {
      const allBikes = await this.findBikesService.findAll();
      return allBikes;
    };
  
    @Get('/:type') 
    async findAllByType(@Param() params): Promise<Bike[]> {
      const allBikesByType = await this.findBikesService.findAllByType(params.type);
      return allBikesByType;
    };
};
