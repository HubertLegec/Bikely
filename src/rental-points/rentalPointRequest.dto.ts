import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class RentalPointRequest {
  @IsString()
  @ApiProperty({ default: '' })
  readonly location: string;

  @IsArray()
  readonly bicycle_id: [string];
}
