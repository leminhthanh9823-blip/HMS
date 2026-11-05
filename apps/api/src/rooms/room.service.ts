import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseService } from "../database/database.service";
import type {
  RoomCapacityInput,
  RoomCreateInput,
  RoomTypeCreateInput,
} from "./room.schemas";

type RoomTypeResponse = {
  id: string;
  propertyId: string;
  code: string;
  name: string;
  saleUnitKind: string;
};
type RoomResponse = {
  id: string;
  propertyId: string;
  roomTypeId: string;
  code: string;
  name: string;
};

@Injectable()
export class RoomService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
  ) {}

  async createType(
    propertyId: string,
    input: RoomTypeCreateInput,
  ): Promise<RoomTypeResponse> {
    const [roomType] = await this.database.$queryRaw<RoomTypeResponse[]>`
      INSERT INTO room_types (id, property_id, code, name, sale_unit_kind)
      SELECT ${randomUUID()}::uuid, id, ${input.code}, ${input.name}, ${input.saleUnitKind}
      FROM properties WHERE id = ${propertyId}::uuid
      RETURNING id::text, property_id::text AS "propertyId", code, name, sale_unit_kind AS "saleUnitKind"
    `;
    if (!roomType) throw new NotFoundException("Property not found");
    return roomType;
  }

  async createRoom(
    propertyId: string,
    input: RoomCreateInput,
  ): Promise<RoomResponse> {
    const [roomType] = await this.database.$queryRaw<Array<{ id: string }>>`
      SELECT id::text FROM room_types WHERE id = ${input.roomTypeId}::uuid AND property_id = ${propertyId}::uuid
    `;
    if (!roomType) throw new NotFoundException("Room type not found");

    const [room] = await this.database.$queryRaw<RoomResponse[]>`
      INSERT INTO rooms (id, property_id, room_type_id, code, name)
      VALUES (${randomUUID()}::uuid, ${propertyId}::uuid, ${input.roomTypeId}::uuid, ${input.code}, ${input.name})
      RETURNING id::text, property_id::text AS "propertyId", room_type_id::text AS "roomTypeId", code, name
    `;
    return room!;
  }

  async setCapacity(
    propertyId: string,
    roomTypeId: string,
    input: RoomCapacityInput,
  ) {
    const [capacity] = await this.database.$queryRaw<
      Array<{
        roomTypeId: string;
        stayDate: string;
        capacity: number;
        sold: number;
      }>
    >`
      INSERT INTO room_type_capacities (property_id, room_type_id, stay_date, capacity)
      SELECT ${propertyId}::uuid, id, ${input.stayDate}::date, ${input.capacity}
      FROM room_types WHERE id = ${roomTypeId}::uuid AND property_id = ${propertyId}::uuid
      ON CONFLICT (room_type_id, stay_date) DO UPDATE SET capacity = EXCLUDED.capacity
      RETURNING room_type_id::text AS "roomTypeId", to_char(stay_date, 'YYYY-MM-DD') AS "stayDate", capacity, sold
    `;
    if (!capacity) throw new NotFoundException("Room type not found");
    return capacity;
  }

  private isConstraintViolation(error: unknown, code: string): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "meta" in error &&
      typeof error.meta === "object" &&
      error.meta !== null &&
      "code" in error.meta &&
      error.meta.code === code
    );
  }

  async withCapacityConstraint<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (this.isConstraintViolation(error, "23514")) {
        throw new ConflictException(
          "Capacity cannot be lower than sold inventory",
        );
      }
      if (this.isConstraintViolation(error, "23505")) {
        throw new ConflictException(
          "Room code or capacity date already exists",
        );
      }
      throw error;
    }
  }
}
