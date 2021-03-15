import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { BikeType } from './bike.type';

export class BikeUpdate {
  @IsOptional()
  @IsEnum(BikeType)
  @ApiProperty({ enum: BikeType, default: BikeType.mtb })
  readonly type: BikeType;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  readonly isElectric: boolean;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(24)
  @ApiProperty({ default: 20 })
  readonly frameSize: number;
}
