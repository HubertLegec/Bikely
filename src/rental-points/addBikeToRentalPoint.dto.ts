import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';

export class addBikeToRentalPoint {

    @IsString()
    @ApiProperty({ default: '' })
    readonly bike_id: string;
  
  }