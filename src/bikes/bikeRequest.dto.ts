import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, Max, Min } from 'class-validator';
import { BikeType } from './bike.type';

export class BikeRequest {
  @IsEnum(BikeType)
  @ApiProperty({ enum: BikeType, default: BikeType.mtb })
  readonly type: BikeType;

  @IsBoolean()
  @ApiProperty({ default: false })
  readonly isElectric: boolean;

  @IsNumber()
  @Min(15)
  @Max(24)
  @ApiProperty({ default: 20 })
  readonly frameSize: number;
}
