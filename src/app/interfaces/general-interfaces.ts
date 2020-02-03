import { Record } from 'src/app/models/record';

export interface IQueryParams {
  year: number;
  day: number;
  date: Date;
}

export interface IDayCat {
  durationInMinutes: number;
  durationAsString: string;
  isOpen: boolean;
  records: number;
  lastRecord: Record;
}
