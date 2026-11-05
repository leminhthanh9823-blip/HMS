import { z } from "zod";
import { isCalendarDate } from "../test-slice/calendar-date";

function isIanaTimeZone(value: string): boolean {
  if (value !== "UTC" && !value.includes("/")) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
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
