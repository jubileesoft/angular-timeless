import { Injectable } from '@angular/core';
import { Record, IRecord, RecordCategory } from 'src/app/models/record';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const STORAGE_VALUES = {
  YEARS: 'years',
  DAYS: (year: number) => {
    return 'days.' + year;
  },
  DAY: (year: number, day: number) => {
    return 'day.' + year + '.' + day;
  }
};

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // #region Properties

  // first number: year, second number[]: days
  days = new Map<number, number[]>();

  // string = 'day.2020.176' (example)
  records = new Map<string, Array<Record>>();

  public selectedYear: number;
  public selectedDay: number;

  // #endregion Properties

  constructor() {
    this._initialize();
  }

  // #region Public Methods

  public getLeftDay(): [number, number] {
    if (!this.selectedYear || !this.selectedDay) {
      return null;
    }

    // The current day and therefore the year is definitely loaded.
    const days = this.days.get(this.selectedYear);
    const index = days.indexOf(this.selectedDay);

    if (index > 0) {
      return [this.selectedYear, days[index - 1]];
    }

    return null;
  }

  public getRightDay(): [number, number] {
    if (!this.selectedYear || !this.selectedDay) {
      return null;
    }

    // The current day and therefore the year is definitely loaded.
    const days = this.days.get(this.selectedYear);
    const index = days.indexOf(this.selectedDay);

    if (index < days.length - 1) {
      return [this.selectedYear, days[index + 1]];
    }

    return null;
  }

  public stopOpenRecords(records: Record[]) {
    const now = Date.now();

    // year, day[]
    const todos = new Map<number, number[]>();

    // manipulate records
    for (const record of records) {
      if (!record.isOpen) {
        continue;
      }
      record.end = now;

      if (!todos.has(record.year)) {
        const days = [record.day];
        todos.set(record.year, days);
      } else {
        const days = todos.get(record.year);
        if (days.indexOf(record.day) === -1) {
          days.push(record.day);
        }
      }
    }

    // for (let i = 0; i < records.length; i++) {
    //   if (!records[i].isOpen) {
    //     continue;
    //   }
    //   records[i].end = now;

    //   const year = records[i].year;
    //   const day = records[i].day;

    //   if (!todos.has(year)) {
    //     const days = [day];
    //     todos.set(year, days);
    //   } else {
    //     const days = todos.get(year);
    //     if (days.indexOf(day) === -1) {
    //       days.push(day);
    //     }
    //   }
    // }

    // persist data to localStorage
    todos.forEach((days, year) => {
      days.forEach(day => {
        this._setDayToStorage(year, day);
      });
    });
  }

  public addRecord(
    year: number,
    day: number,
    category: RecordCategory
  ): Record[] {
    // make sure that all existing records for that day are loaded
    const records = this.getRecords(year, day);

    // make sure that year and day are stored
    this.addDay(year, day);

    // create new record and add it to array
    const record = new Record(category, Date.now());
    records.push(record);

    // serialize to localStorage
    this._setRecordsToStorage(year, day, records);
    return records;
  }

  public getRecords(year: number, day: number): Array<Record> {
    const key = STORAGE_VALUES.DAY(year, day);
    if (this.records.has(key)) {
      return this.records.get(key);
    }

    const iRecords = this._getRecordsFromStorage(year, day);

    const records: Array<Record> = [];
    iRecords.forEach(iRecord => {
      records.push(Record.fromIRecord(iRecord));
    });

    this.records.set(key, records);

    return records;
  }

  public addYear(year: number) {
    if (this.days.has(year)) {
      return;
    }

    this.days.set(year, []);

    const years = Array.from<number>(this.days.keys());

    window.localStorage.setItem(STORAGE_VALUES.YEARS, JSON.stringify(years));
  }

  public addDay(year: number, day: number) {
    if (!this.days.has(year)) {
      this.addYear(year);
    }

    const days = this.days.get(year);

    if (days.indexOf(day) !== -1) {
      return;
    }

    days.push(day);

    window.localStorage.setItem(
      STORAGE_VALUES.DAYS(year),
      JSON.stringify(days)
    );
  }

  // #endregion Public Methods

  // #region Private Methods

  private _initialize() {
    const years = this._getYearsFromStorage();
    years.forEach(year => {
      this.days.set(year, this._getDaysFromStorage(year));
    });
  }

  private _getYearsFromStorage(): Array<number> {
    const years: Array<number> = [];

    const yearsString = window.localStorage.getItem(STORAGE_VALUES.YEARS);
    if (!yearsString) {
      return years;
    }
    return JSON.parse(yearsString);
  }

  private _getDaysFromStorage(year: number): Array<number> {
    const days: Array<number> = [];

    const daysString = window.localStorage.getItem(STORAGE_VALUES.DAYS(year));
    if (!daysString) {
      return days;
    }

    return JSON.parse(daysString);
  }

  private _getRecordsFromStorage(year: number, day: number): Array<IRecord> {
    const key = STORAGE_VALUES.DAY(year, day);

    const serializedRecords = window.localStorage.getItem(key);
    if (!serializedRecords) {
      return [];
    }

    const iRecords: Array<IRecord> = JSON.parse(serializedRecords);
    return iRecords;
  }

  private _setRecordsToStorage(year: number, day: number, records: Record[]) {
    const key = STORAGE_VALUES.DAY(year, day);

    const serializableRecords = records.map(record => record.searialize());
    window.localStorage.setItem(key, JSON.stringify(serializableRecords));
  }

  private _setDayToStorage(year: number, day: number) {
    const key = STORAGE_VALUES.DAY(year, day);

    const records = this.records.get(key);

    const serializableRecords = records.map(record => record.searialize());
    window.localStorage.setItem(key, JSON.stringify(serializableRecords));
  }

  // #endregion Private Methods
}
