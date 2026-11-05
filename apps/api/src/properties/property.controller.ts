import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ZodValidationPipe } from "../common/validation/zod-validation.pipe";
import {
  propertyCreateSchema,
  propertyIdSchema,
  propertyStatusSchema,
} from "./property.schemas";
import { PropertyService } from "./property.service";

@Controller("properties")
export class PropertyController {
  constructor(
    @Inject(PropertyService) private readonly properties: PropertyService,
  ) {}

  @Post()
  create(@Body(new ZodValidationPipe(propertyCreateSchema)) body: unknown) {
    return this.properties.create(
      body as ReturnType<typeof propertyCreateSchema.parse>,
    );
  }

  @Get(":propertyId")
  get(
    @Param("propertyId", new ZodValidationPipe(propertyIdSchema))
    propertyId: string,
  ) {
    return this.properties.get(propertyId);
  }

  @Patch(":propertyId/status")
  changeStatus(
    @Param("propertyId", new ZodValidationPipe(propertyIdSchema))
    propertyId: string,
    @Body(new ZodValidationPipe(propertyStatusSchema)) body: unknown,
  ) {
    return this.properties.changeStatus(
      propertyId,
      body as ReturnType<typeof propertyStatusSchema.parse>,
    );
  }
}
