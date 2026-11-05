import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "../common/validation/zod-validation.pipe";
import {
  availabilityQuerySchema,
  bookingPropertyIdSchema,
  createHoldSchema,
  idempotencyKeySchema,
} from "./booking.schemas";
import { BookingService } from "./booking.service";

@Controller("properties/:propertyId")
export class BookingController {
  constructor(
    @Inject(BookingService) private readonly bookings: BookingService,
  ) {}

  @Get("availability")
  availability(
    @Param("propertyId", new ZodValidationPipe(bookingPropertyIdSchema))
    propertyId: string,
    @Query(new ZodValidationPipe(availabilityQuerySchema)) query: unknown,
  ) {
    return this.bookings.availability(
      propertyId,
      query as ReturnType<typeof availabilityQuerySchema.parse>,
    );
  }

  @Post("bookings/holds")
  createHold(
    @Param("propertyId", new ZodValidationPipe(bookingPropertyIdSchema))
    propertyId: string,
    @Headers("idempotency-key") idempotencyKey: string | undefined,
    @Body(new ZodValidationPipe(createHoldSchema)) body: unknown,
  ) {
    const parsedKey = idempotencyKeySchema.safeParse(idempotencyKey);
    if (!parsedKey.success)
      throw new BadRequestException(
        "A valid Idempotency-Key header is required",
      );
    return this.bookings.createHold(
      propertyId,
      parsedKey.data,
      body as ReturnType<typeof createHoldSchema.parse>,
    );
  }
}
