import { Injectable } from "@angular/core";

const USEC_PER_DAY = 24 * 3600 * 1000;

export const WEEKDAY_DATE_MAP = {
  Mon: new Date("2020-01-06T00:00:00.000Z"),
  Tue: new Date("2020-01-07T00:00:00.000Z"),
  Wed: new Date("2020-01-08T00:00:00.000Z"),
  Thu: new Date("2020-01-09T00:00:00.000Z"),
  Fri: new Date("2020-01-10T00:00:00.000Z"),
  Sat: new Date("2020-01-11T00:00:00.000Z"),
  Sun: new Date("2020-01-12T00:00:00.000Z"),
};

@Injectable({ providedIn: "root" })
export class RegionalFormattingService {
  private formatters: {
    date: {
      [opt: string]: Intl.DateTimeFormat;
    };
    relativeDate: {
      [opt: string]: any; // Intl.RelativeTimeFormat;
    };
    number: {
      [opt: string]: Intl.NumberFormat;
    };
  };

  private locale!: string | string[];

  constructor() {
    this.formatters = { date: {}, relativeDate: {}, number: {} };
    this.setLocale(navigator.languages as string[]);
  }

  setLocale(locale: string | string[]) {
    this.locale = locale;
    this.formatters = { date: {}, relativeDate: {}, number: {} };
  }

  getLocale(): string {
    return Array.isArray(this.locale) ? this.locale[0] : this.locale;
  }

  defaultDate(ts: number): string {
    return this.getDate(ts);
  }

  dateWithWeekday(ts: number): string {
    return this.getWeekDay(ts) + " " + this.defaultDate(ts);
  }

  defaultTime(ts: number): string {
    const opts = {
      hour: "numeric",
      minute: "numeric",
    };
    return this.getDate(ts, opts);
  }

  defaultDateTime(ts: number): string {
    return this.defaultDate(ts) + " " + this.defaultTime(ts);
  }

  defaultRelativeDateTime(ts: number): string {
    const timePart = " " + this.defaultTime(ts);
    // Check if yesterday, today or tomorrow
    const diff = [-1, 0, 1];
    const now = Date.now();
    const times = diff.map((i) => new Date(now + USEC_PER_DAY * i).getTime());
    const currentDateStr = this.defaultDate(ts);
    const index = times.findIndex((i) => this.defaultDate(i) == currentDateStr);
    if (index > -1) {
      return this.relativeDateStr(diff[index]) + timePart;
    }
    const endOfDay = new Date(now);
    endOfDay.setHours(23);
    endOfDay.setMilliseconds(59);
    endOfDay.setSeconds(59);
    const earlier = new Date(Date.now() - USEC_PER_DAY * 8).getTime();
    const currentDate = new Date(ts);
    // Less than 7 days ahead
    if (
      earlier < ts &&
      endOfDay.getTime() > ts &&
      getWeek(endOfDay) === getWeek(currentDate)
    ) {
      return this.getWeekDay(ts) + timePart;
    }
    // Earlier
    return (
      this.getDayOfWeek(new Date(ts)) +
      " " +
      this.getDate(ts, { month: "numeric", day: "numeric" }) +
      timePart
    );
  }

  getDayOfWeek(date: Date, length: "short" | "long" = "short") {
    const day = this.getDate(date, {
      weekday: length,
    });
    return day[0].toUpperCase() + day.slice(1);
  }

  getMonth(date: Date, length: "short" | "long" = "long") {
    const day = this.getDate(date, {
      month: length,
    });
    return day[0].toUpperCase() + day.slice(1);
  }

  getDayOfWeekFromEnglishDay(
    shortEnglishDay: keyof typeof WEEKDAY_DATE_MAP,
    length: "short" | "long" = "short"
  ) {
    return this.getDayOfWeek(WEEKDAY_DATE_MAP[shortEnglishDay], length);
  }

  getShortWeekDaysEnglish() {
    return Object.keys(WEEKDAY_DATE_MAP);
  }

  getWeekDays(length: "short" | "long" = "short") {
    const shortWeekdays = Object.keys(
      WEEKDAY_DATE_MAP
    ) as (keyof typeof WEEKDAY_DATE_MAP)[];
    return shortWeekdays.map((shortName) =>
      this.getDayOfWeekFromEnglishDay(shortName, length)
    );
  }

  private relativeDateStr(diff: number) {
    const str = this.getRelativeDateFormatter({ numeric: "auto" }).format(
      diff,
      "day"
    );
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getWeekDay(ts: number) {
    const opts = { weekday: "long" };
    const weekday = this.getDate(ts, opts);
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }

  getDate(date: number | Date, opts: Intl.DateTimeFormatOptions | any = {}) {
    const formatter = this.getDateFormatter(opts);
    return formatter.format(date);
  }

  private getRelativeDateFormatter(opts: any) {
    const hash = JSON.stringify(opts);
    if (!(hash in this.formatters.relativeDate)) {
      this.formatters.relativeDate[hash] = new (Intl as any).RelativeTimeFormat(
        this.locale,
        opts
      );
    }
    return this.formatters.relativeDate[hash];
  }

  private getDateFormatter(opts: any) {
    const hash = JSON.stringify(opts);
    if (!(hash in this.formatters.date)) {
      this.formatters.date[hash] = new Intl.DateTimeFormat(this.locale, opts);
    }
    return this.formatters.date[hash];
  }

  private getNumberFormatter(opts: any) {
    const hash = JSON.stringify(opts);
    if (!(hash in this.formatters.number)) {
      this.formatters.number[hash] = new Intl.NumberFormat(this.locale, opts);
    }
    return this.formatters.number[hash];
  }
}

// https://weeknumber.net/how-to/javascript
function getWeek(date: Date) {
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}
