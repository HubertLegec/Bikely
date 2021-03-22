import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class addBikeToRentalPoint {
  @IsString()
  @ApiProperty({ default: '' })
  readonly bike_id: string;
}
