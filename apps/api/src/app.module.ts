import { Module, type DynamicModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health.controller";
import { PropertyController } from "./properties/property.controller";
import { PropertyService } from "./properties/property.service";

@Module({
  controllers: [HealthController],
})
export class AppModule {
  static register(
    rateLimit: { limit: number; ttl: number },
    databaseEnabled: boolean,
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ThrottlerModule.forRoot({ throttlers: [rateLimit] }),
        ...(databaseEnabled ? [DatabaseModule] : []),
      ],
      controllers: databaseEnabled ? [PropertyController] : [],
      providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        ...(databaseEnabled ? [PropertyService] : []),
      ],
    };
  }
}
