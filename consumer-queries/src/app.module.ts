import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@core/kafka/kafka.module';
import { QueryModule } from '@modules/query/query.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), KafkaModule, QueryModule],
})
export class AppModule {}
