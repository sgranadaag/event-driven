import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@core/kafka/kafka.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), KafkaModule, HealthModule],
})
export class AppModule {}
