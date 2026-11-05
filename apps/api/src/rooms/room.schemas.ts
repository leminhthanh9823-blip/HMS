import { z } from "zod";
import { testAssumptions } from "../test-slice/test-assumptions";

export const roomTypeCreateSchema = z
  .object({
    code: z.string().trim().min(1).max(32),
    name: z.string().trim().min(1).max(120),
    saleUnitKind: z.enum(testAssumptions.saleUnits as [string, ...string[]]),
  })
  .strict();

export const roomCreateSchema = z
  .object({
    roomTypeId: z.string().uuid(),
    code: z.string().trim().min(1).max(32),
    name: z.string().trim().min(1).max(120),
  })
  .strict();

export const roomCapacitySchema = z
  .object({
    stayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    capacity: z.number().int().min(0),
  })
  .strict();

export const roomPropertyIdSchema = z.string().uuid();

export type RoomTypeCreateInput = z.infer<typeof roomTypeCreateSchema>;
export type RoomCreateInput = z.infer<typeof roomCreateSchema>;
export type RoomCapacityInput = z.infer<typeof roomCapacitySchema>;
