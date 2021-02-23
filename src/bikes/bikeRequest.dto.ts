import { ApiProperty } from '@nestjs/swagger';

export class BikeRequest {
  @ApiProperty()
  readonly type: string;
}
