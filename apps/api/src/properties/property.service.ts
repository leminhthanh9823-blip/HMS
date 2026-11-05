import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseService } from "../database/database.service";
import type {
  PropertyCreateInput,
  PropertyStatusInput,
} from "./property.schemas";

export type PropertyResponse = {
  id: string;
  code: string;
  name: string;
  timezone: string;
  status: string;
  businessDate: string;
};

@Injectable()
export class PropertyService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
  ) {}

  async create(input: PropertyCreateInput): Promise<PropertyResponse> {
    try {
      const [property] = await this.database.$queryRaw<PropertyResponse[]>`
        INSERT INTO properties (id, code, name, timezone, status, business_date)
        VALUES (${randomUUID()}::uuid, ${input.code}, ${input.name}, ${input.timezone}, 'Draft'::"PropertyStatus", ${input.businessDate}::date)
        RETURNING id::text, code, name, timezone, status::text, to_char(business_date, 'YYYY-MM-DD') AS "businessDate"
      `;
      return property!;
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException("Property code already exists");
      }
      throw error;
    }
  }

  async get(propertyId: string): Promise<PropertyResponse> {
    const [property] = await this.database.$queryRaw<PropertyResponse[]>`
      SELECT id::text, code, name, timezone, status::text, to_char(business_date, 'YYYY-MM-DD') AS "businessDate"
      FROM properties WHERE id = ${propertyId}::uuid
    `;
    if (!property) throw new NotFoundException("Property not found");
    return property;
  }

  async changeStatus(
    propertyId: string,
    input: PropertyStatusInput,
  ): Promise<PropertyResponse> {
    const [property] = await this.database.$queryRaw<PropertyResponse[]>`
      UPDATE properties SET status = ${input.status}::"PropertyStatus", updated_at = CURRENT_TIMESTAMP
      WHERE id = ${propertyId}::uuid
      RETURNING id::text, code, name, timezone, status::text, to_char(business_date, 'YYYY-MM-DD') AS "businessDate"
    `;
    if (!property) throw new NotFoundException("Property not found");
    return property;
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "meta" in error &&
      typeof error.meta === "object" &&
      error.meta !== null &&
      "code" in error.meta &&
      error.meta.code === "23505"
    );
  }
}
