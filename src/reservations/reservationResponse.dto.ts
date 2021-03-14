export class ReservationRequest {
  readonly id: string;
  readonly bike_id: string;
  readonly user_id: string;
  readonly plannedDateFrom: Date;
  readonly plannedDateTo: Date;
  readonly rentalPointFrom_id: string;
  readonly rentalPointTo_id: string;
}
