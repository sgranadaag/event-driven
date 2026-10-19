import { Global, Module } from '@nestjs/common';
import { RabbitSubscriber } from './rabbit.subscriber';

@Global()
@Module({
  providers: [RabbitSubscriber],
  exports: [RabbitSubscriber],
})
export class RabbitModule {}
