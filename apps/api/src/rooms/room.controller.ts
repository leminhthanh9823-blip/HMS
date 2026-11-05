import { Body, Controller, Inject, Param, Post, Put } from "@nestjs/common";
import { ZodValidationPipe } from "../common/validation/zod-validation.pipe";
import {
  roomCapacitySchema,
  roomCreateSchema,
  roomPropertyIdSchema,
  roomTypeCreateSchema,
} from "./room.schemas";
import { RoomService } from "./room.service";

@Controller("properties/:propertyId")
export class RoomController {
  constructor(@Inject(RoomService) private readonly rooms: RoomService) {}

  @Post("room-types")
  createType(
    @Param("propertyId", new ZodValidationPipe(roomPropertyIdSchema))
    propertyId: string,
    @Body(new ZodValidationPipe(roomTypeCreateSchema)) body: unknown,
  ) {
    return this.rooms.createType(
      propertyId,
      body as ReturnType<typeof roomTypeCreateSchema.parse>,
    );
  }

  @Post("rooms")
  createRoom(
    @Param("propertyId", new ZodValidationPipe(roomPropertyIdSchema))
    propertyId: string,
    @Body(new ZodValidationPipe(roomCreateSchema)) body: unknown,
  ) {
    return this.rooms.createRoom(
      propertyId,
      body as ReturnType<typeof roomCreateSchema.parse>,
    );
  }

  @Put("room-types/:roomTypeId/capacity")
  setCapacity(
    @Param("propertyId", new ZodValidationPipe(roomPropertyIdSchema))
    propertyId: string,
    @Param("roomTypeId", new ZodValidationPipe(roomPropertyIdSchema))
    roomTypeId: string,
    @Body(new ZodValidationPipe(roomCapacitySchema)) body: unknown,
  ) {
    return this.rooms.withCapacityConstraint(() =>
      this.rooms.setCapacity(
        propertyId,
        roomTypeId,
        body as ReturnType<typeof roomCapacitySchema.parse>,
      ),
    );
  }
}
