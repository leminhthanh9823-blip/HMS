export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  return (
    month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month)
  );
}

export function addCalendarDays(value: string, count: number): string {
  if (!isCalendarDate(value) || !Number.isSafeInteger(count)) {
    throw new Error("Invalid calendar date operation");
  }
  let year = Number(value.slice(0, 4));
  let month = Number(value.slice(5, 7));
  let day = Number(value.slice(8, 10));
  const direction = Math.sign(count);
  for (let remaining = Math.abs(count); remaining > 0; remaining -= 1) {
    day += direction;
    if (direction > 0 && day > daysInMonth(year, month)) {
      day = 1;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    } else if (direction < 0 && day < 1) {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      day = daysInMonth(year, month);
    }
  }
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ]!;
}

export function propertyLocalDateAt(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function stayNights(arrival: string, departure: string): string[] {
  if (
    !isCalendarDate(arrival) ||
    !isCalendarDate(departure) ||
    departure <= arrival
  ) {
    throw new Error(
      "A stay must use valid dates and include at least one night",
    );
  }
  const dates: string[] = [];
  for (let date = arrival; date < departure; date = addCalendarDays(date, 1)) {
    dates.push(date);
  }
  return dates;
}
