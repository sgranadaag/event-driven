import { Injectable } from '@nestjs/common';
import { KafkaPublisher } from '@core/kafka/kafka.publisher';
import { KAFKA_SCHEMA } from '@core/kafka/kafka.schema';
import { generateId } from '@utils/crypto.util';
import {
  INTERACTION_CLICK_MESSAGE,
  INTERACTION_PARTITIONS,
  INTERACTION_SCROLL_MESSAGE,
  INTERACTION_VIEW_MESSAGE,
} from './interaction.constants';
import type {
  Click,
  Interaction,
  Scroll,
  View,
} from './interfaces/interaction.interface';
import type {
  ClickInput,
  PublishInteractionResult,
  ScrollInput,
  ViewInput,
} from './interfaces/publishInteraction.interface';

@Injectable()
export class InteractionService {
  constructor(private readonly kafkaPublisher: KafkaPublisher) {}

  view({ userId, page }: ViewInput): Promise<PublishInteractionResult> {
    const view: View = { id: generateId(), userId, page };

    return this.publish(INTERACTION_VIEW_MESSAGE, INTERACTION_PARTITIONS.view, view);
  }

  click({ userId, page, element }: ClickInput): Promise<PublishInteractionResult> {
    const click: Click = { id: generateId(), userId, page, element };

    return this.publish(INTERACTION_CLICK_MESSAGE, INTERACTION_PARTITIONS.click, click);
  }

  scroll({ userId, page, depth }: ScrollInput): Promise<PublishInteractionResult> {
    const scroll: Scroll = { id: generateId(), userId, page, depth };

    return this.publish(
      INTERACTION_SCROLL_MESSAGE,
      INTERACTION_PARTITIONS.scroll,
      scroll,
    );
  }

  private async publish(
    type: string,
    partition: number,
    interaction: Interaction,
  ): Promise<PublishInteractionResult> {
    const result = await this.kafkaPublisher.publish({
      topic: KAFKA_SCHEMA.topics.interactions.name,
      type,
      key: interaction.userId,
      partition,
      payload: interaction,
    });

    return { interaction, ...result };
  }
}
