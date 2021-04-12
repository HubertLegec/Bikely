import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsMongoId } from 'class-validator';

export class ReservationRequest {
  @IsMongoId()
  @ApiProperty()
  readonly bike_id: string;
  @IsISO8601()
  @ApiProperty()
  readonly plannedDateFrom: Date;
  @IsISO8601()
  @ApiProperty()
  readonly plannedDateTo: Date;
  @IsMongoId()
  @ApiProperty()
  readonly rentalPointFrom_id: string;
  @IsMongoId()
  @ApiProperty()
  readonly rentalPointTo_id: string;
}
