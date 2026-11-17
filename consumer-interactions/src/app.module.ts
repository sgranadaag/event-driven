import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@core/kafka/kafka.module';
import { InteractionModule } from '@modules/interaction/interaction.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), KafkaModule, InteractionModule],
})
export class AppModule {}
