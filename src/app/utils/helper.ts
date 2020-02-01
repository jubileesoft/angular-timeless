export class TimeHelper {
  public static minutesToString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const lastHourMinutes = minutes % 60;

    return (
      hours.toString().padStart(2, '0') +
      ':' +
      lastHourMinutes.toString().padStart(2, '0')
    );
  }
}

export class DateHelper {
  public static getDayOfYear(date: Date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff: number =
      date.getTime() -
      start.getTime() +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
  }

  public static sameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }
}
