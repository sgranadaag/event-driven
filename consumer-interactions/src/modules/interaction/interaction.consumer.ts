import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaSubscriber } from '@core/kafka/kafka.subscriber';
import {
  INTERACTION_CLICK_MESSAGE,
  INTERACTION_SCROLL_MESSAGE,
  INTERACTION_VIEW_MESSAGE,
} from './interaction.constants';
import { InteractionService } from './interaction.service';
import type { Click, Scroll, View } from './interfaces/interaction.interface';

@Injectable()
export class InteractionConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaSubscriber: KafkaSubscriber,
    private readonly interactionService: InteractionService,
  ) {}

  onModuleInit(): void {
    this.kafkaSubscriber.subscribe<View>(INTERACTION_VIEW_MESSAGE, (message) =>
      this.interactionService.view(message),
    );
    this.kafkaSubscriber.subscribe<Click>(INTERACTION_CLICK_MESSAGE, (message) =>
      this.interactionService.click(message),
    );
    this.kafkaSubscriber.subscribe<Scroll>(INTERACTION_SCROLL_MESSAGE, (message) =>
      this.interactionService.scroll(message),
    );
  }
}
