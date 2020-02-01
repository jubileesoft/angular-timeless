import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';
import { Record, RecordCategory } from 'src/app/models/record';
import { StoreService } from 'src/app/services/store.service';
import { DateHelper, TimeHelper } from 'src/app/utils/helper';

import { IQueryParams, IDayCat } from 'src/app/interfaces/general-interfaces';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  // #region Properties

  records: Record[];
  queryParams$: Observable<IQueryParams>;
  queryParams: IQueryParams;
  ticker = timer(1000, 2000);

  get recordsCatA() {
    return this.records.filter(record => record.category === RecordCategory.A);
  }

  get recordsCatB() {
    return this.records.filter(record => record.category === RecordCategory.B);
  }

  get recordsCatC() {
    return this.records.filter(record => record.category === RecordCategory.C);
  }

  get catA(): IDayCat {
    const records = this.recordsCatA;

    const duration = records.reduce(
      (acc, curr) => acc + curr.getDurationInMinutes(),
      0
    );

    let isOpen = false;

    if (records.length > 0) {
      isOpen = records[records.length - 1].end == null;
    }

    return {
      durationInMinutes: duration,
      durationAsString: TimeHelper.minutesToString(duration),
      isOpen
    };
  }

  get isCatAButtonDisabled(): boolean {
    const now = new Date();
    const isToday =
      this.queryParams.year == now.getFullYear() &&
      this.queryParams.day == DateHelper.getDayOfYear(now);

    return (
      !isToday || this.recordsCatA.findIndex(x => x.isOpen === true) !== -1
    );
  }

  get catB(): IDayCat {
    const records = this.recordsCatB;

    const duration = records.reduce(
      (acc, curr) => acc + curr.getDurationInMinutes(),
      0
    );

    let isOpen = false;

    if (records.length > 0) {
      isOpen = records[records.length - 1].end == null;
    }

    return {
      durationInMinutes: duration,
      durationAsString: TimeHelper.minutesToString(duration),
      isOpen
    };
  }

  get isCatBButtonDisabled(): boolean {
    const now = new Date();
    const isToday =
      this.queryParams.year == now.getFullYear() &&
      this.queryParams.day == DateHelper.getDayOfYear(now);

    return (
      !isToday || this.recordsCatB.findIndex(x => x.isOpen === true) !== -1
    );
  }

  get catC(): IDayCat {
    const records = this.recordsCatC;

    const duration = records.reduce(
      (acc, curr) => acc + curr.getDurationInMinutes(),
      0
    );

    let isOpen = false;

    if (records.length > 0) {
      isOpen = records[records.length - 1].end == null;
    }

    return {
      durationInMinutes: duration,
      durationAsString: TimeHelper.minutesToString(duration),
      isOpen
    };
  }

  get isCatCButtonDisabled(): boolean {
    const now = new Date();
    const isToday =
      this.queryParams.year == now.getFullYear() &&
      this.queryParams.day == DateHelper.getDayOfYear(now);

    return (
      !isToday || this.recordsCatC.findIndex(x => x.isOpen === true) !== -1
    );
  }
  // #endregion Properties

  constructor(private route: ActivatedRoute, private store: StoreService) {}

  ngOnInit() {
    this.queryParams$ = this.route.paramMap.pipe(
      switchMap(params => {
        const yearString = params.get('year');
        const dayString = params.get('day');

        let year: number = Number(yearString);
        let day: number = Number(dayString);

        if (!yearString || !dayString) {
          const now = new Date();
          day = DateHelper.getDayOfYear(now);
          year = now.getFullYear();
        }

        const queryParams: IQueryParams = {
          year,
          day
        };

        return of(queryParams);
      })
    );

    this.queryParams$.subscribe(value => {
      console.log('subscription event');
      this.queryParams = value;
      this.records = this.store.getRecords(value.year, value.day);
    });

    this.ticker.subscribe(x => this.tick(x));
  }

  newRecord(categoryString: string) {
    const category: RecordCategory = RecordCategory[categoryString];
    if (typeof category === 'undefined') {
      return;
    }

    const records = this.store.addRecord(
      this.queryParams.year,
      this.queryParams.day,
      category
    );
  }

  stopOpenRecord(categoryString: string) {
    const category: RecordCategory = RecordCategory[categoryString];
    if (typeof category === 'undefined') {
      return;
    }

    let records: Record[] = null;

    if (category === RecordCategory.A) {
      records = this.recordsCatA;
    } else if (category === RecordCategory.B) {
      records = this.recordsCatB;
    } else {
      records = this.recordsCatC;
    }

    this.store.stopOpenRecords(records);

    const now = Date.now();
  }

  tick(value) {}
}
