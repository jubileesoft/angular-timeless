import { uuid } from 'uuidv4';
import { DateHelper } from 'src/app/utils/helper';

export enum RecordCategory {
  A,
  B,
  C
}

export enum Duraction {
  inMinutes,
  asString
}

export interface IRecord {
  id: string;
  category: RecordCategory;
  start: number;
  end: number;
}

export class Record {
  // #region Properties

  public id: string;

  public category: RecordCategory;

  public start: number;

  public end: number = null;

  public get year() {
    return new Date(this.start).getFullYear();
  }

  public get day() {
    return DateHelper.getDayOfYear(new Date(this.start));
  }

  public get isOpen() {
    return this.end == null;
  }

  public get durationString() {
    let duration = DateHelper.dateToString(new Date(this.start));
    duration += ' - ';

    if (this.end != null) {
      duration += DateHelper.dateToString(new Date(this.end));
    } else {
      duration += '...';
    }

    return duration;
  }

  // #endregion Properties

  // #region Constructor

  constructor(category: RecordCategory, start: number, id = null) {
    if (id != null) {
      this.id = id;
    } else {
      this.id = uuid();
    }

    this.category = category;
    this.start = start;
  }

  // #endregion Constructor

  static fromIRecord(iRecord: IRecord): Record {
    const record = new Record(iRecord.category, iRecord.start, iRecord.id);
    record.end = iRecord.end;

    return record;
  }

  // #region Methods

  getDurationInMinutes(): number {
    let end = this.end;
    if (end == null) {
      // no end defined. distinguish two variants
      // variant 1: we are currently on the same day
      // variant 2: we are on another day

      const startDate = new Date(this.start);
      const nowDate = new Date();
      if (!DateHelper.sameDay(startDate, nowDate)) {
        return 0; // variant 2
      }

      end = nowDate.getTime();
    }

    const durationInMinutes = Math.floor((end - this.start) / 1000 / 60);

    return durationInMinutes;
  }

  searialize() {
    const object = {
      id: this.id,
      category: this.category,
      start: this.start,
      end: this.end
    };
    return object;
  }

  // #endregion Methods
}
