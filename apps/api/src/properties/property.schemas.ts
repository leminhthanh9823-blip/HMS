import { z } from "zod";

function isIanaTimeZone(value: string): boolean {
  if (value !== "UTC" && !value.includes("/")) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLengths = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return (
    month >= 1 && month <= 12 && day >= 1 && day <= monthLengths[month - 1]!
  );
}

export const propertyCreateSchema = z
  .object({
    code: z.string().trim().min(1).max(32),
    name: z.string().trim().min(1).max(160),
    timezone: z.string().trim().min(1).max(128).refine(isIanaTimeZone),
    businessDate: z.string().refine(isCalendarDate),
  })
  .strict();

export const propertyStatusSchema = z
  .object({
    status: z.enum(["Draft", "Active", "Suspended", "Closed"]),
  })
  .strict();

export const propertyIdSchema = z.string().uuid();

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
export type PropertyStatusInput = z.infer<typeof propertyStatusSchema>;
