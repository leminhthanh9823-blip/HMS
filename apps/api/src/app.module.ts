import { Module, type DynamicModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController],
})
export class AppModule {
  static register(rateLimit: { limit: number; ttl: number }): DynamicModule {
    return {
      module: AppModule,
      imports: [ThrottlerModule.forRoot({ throttlers: [rateLimit] })],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    };
  }
}
