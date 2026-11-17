import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@core/kafka/kafka.module';
import { HealthModule } from '@modules/health/health.module';
import { InteractionModule } from '@modules/interaction/interaction.module';
import { QueryModule } from '@modules/query/query.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule,
    InteractionModule,
    QueryModule,
    HealthModule,
  ],
})
export class AppModule {}
