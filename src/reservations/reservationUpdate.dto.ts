import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsOptional } from 'class-validator';

export class ReservationUpdate {
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  readonly bike_id: string;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly plannedDateFrom: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly plannedDateTo: Date;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  readonly rentalPointFrom_id: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  readonly rentalPointTo_id: string;
}
