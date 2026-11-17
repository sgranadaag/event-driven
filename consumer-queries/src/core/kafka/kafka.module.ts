import { Global, Module } from '@nestjs/common';
import { KafkaSubscriber } from './kafka.subscriber';

@Global()
@Module({
  providers: [KafkaSubscriber],
  exports: [KafkaSubscriber],
})
export class KafkaModule {}
