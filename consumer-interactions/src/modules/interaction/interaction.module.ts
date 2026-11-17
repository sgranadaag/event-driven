import { Module } from '@nestjs/common';
import { InteractionConsumer } from './interaction.consumer';
import { InteractionService } from './interaction.service';

@Module({
  providers: [InteractionConsumer, InteractionService],
})
export class InteractionModule {}
