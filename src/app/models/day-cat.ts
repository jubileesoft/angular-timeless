import { TimeHelper } from 'src/app/utils/helper';
import { Record } from 'src/app/models/record';

export default class DayCat {
  // #region Properties

  public records: Record[] = [];

  public get durationInMinutes() {
    return this.records.reduce(
      (acc, curr) => acc + curr.getDurationInMinutes(),
      0
    );
  }

  public get isOpen() {
    let isOpen = false;

    if (this.records.length > 0) {
      isOpen = this.records[this.records.length - 1].end == null;
    }

    return isOpen;
  }

  public get durationAsString() {
    return TimeHelper.minutesToString(this.durationInMinutes);
  }

  public get lastRecordDurationString() {
    if (this.records.length > 0) {
      return this.records[this.records.length - 1].durationString;
    } else {
      return '';
    }
  }

  // #endregion Properties

  // #region Constructor

  constructor(records: Record[]) {
    if (records.length === 0) {
      return;
    }

    this.records = records;
  }

  // #endregion Constructor
}
