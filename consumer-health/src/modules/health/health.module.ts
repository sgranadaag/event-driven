import { Module } from '@nestjs/common';
import { HealthConsumer } from './health.consumer';
import { HealthService } from './health.service';

@Module({
  providers: [HealthConsumer, HealthService],
})
export class HealthModule {}
