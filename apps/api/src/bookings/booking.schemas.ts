import { z } from "zod";
import { isCalendarDate } from "../test-slice/calendar-date";

export const createHoldSchema = z
  .object({
    roomIds: z.array(z.string().uuid()).min(1),
    arrival: z.string().refine(isCalendarDate),
    departure: z.string().refine(isCalendarDate),
  })
  .strict()
  .refine((value) => value.departure > value.arrival, {
    message: "A stay must include at least one night",
  })
  .refine((value) => new Set(value.roomIds).size === value.roomIds.length, {
    message: "Room IDs must be unique",
  });

export const availabilityQuerySchema = z
  .object({
    arrival: z.string().refine(isCalendarDate),
    departure: z.string().refine(isCalendarDate),
  })
  .strict()
  .refine((value) => value.departure > value.arrival, {
    message: "A stay must include at least one night",
  });

export const idempotencyKeySchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9._:-]+$/);

export const bookingPropertyIdSchema = z.string().uuid();

export type CreateHoldInput = z.infer<typeof createHoldSchema>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
