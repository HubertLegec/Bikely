import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId } from 'class-validator';

export class ReservationRequest {
  @IsMongoId()
  @ApiProperty()
  readonly bike_id: string;
  @IsMongoId()
  @ApiProperty()
  readonly user_id: string;
  @IsDate()
  @ApiProperty()
  readonly plannedDateFrom: Date;
  @IsDate()
  @ApiProperty()
  readonly plannedDateTo: Date;
  @IsMongoId()
  @ApiProperty()
  readonly rentalPointFrom_id: string;
  @IsMongoId()
  @ApiProperty()
  readonly rentalPointTo_id: string;
}
