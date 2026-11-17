import { Global, Module } from '@nestjs/common';
import { KafkaPublisher } from './kafka.publisher';

@Global()
@Module({
  providers: [KafkaPublisher],
  exports: [KafkaPublisher],
})
export class KafkaModule {}
