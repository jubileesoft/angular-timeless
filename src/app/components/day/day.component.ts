import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';
import { Record, RecordCategory } from 'src/app/models/record';
import { StoreService } from 'src/app/services/store.service';
import { DateHelper, TimeHelper } from 'src/app/utils/helper';

import { IQueryParams } from 'src/app/interfaces/general-interfaces';
import DayCat from 'src/app/models/day-cat';

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

  get catA(): DayCat {
    const records = this.recordsCatA;
    return this._buildDayCat(records);
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

  get catB(): DayCat {
    const records = this.recordsCatB;
    return this._buildDayCat(records);
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

  get catC(): DayCat {
    const records = this.recordsCatC;
    return this._buildDayCat(records);
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

  get catAll(): DayCat {
    return this._buildDayCat(this.records);
  }

  // #endregion Properties

  // #region Hooks

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService
  ) {}

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
          day,
          date: DateHelper.constructDate(year, day)
        };

        return of(queryParams);
      })
    );

    this.queryParams$.subscribe(value => {
      console.log('subscription event');
      this.queryParams = value;
      this.records = this.store.getRecords(value.year, value.day);
      this.store.selectedYear = value.year;
      this.store.selectedDay = value.day;
    });

    this.ticker.subscribe(x => this.tick(x));
  }

  // #endregion Hooks

  // #region Methoods

  edit(categoryString: string) {
    const category: RecordCategory = RecordCategory[categoryString];
    this.router.navigate([
      '/edit',
      {
        year: this.queryParams.year,
        day: this.queryParams.day
      }
    ]);
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

  private _buildDayCat(records: Record[]): DayCat {
    return new DayCat(records);
  }

  // #endregion Methods
}
