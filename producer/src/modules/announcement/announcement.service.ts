import { Injectable } from '@nestjs/common';
import { EMPTY_ROUTING_KEY } from '@core/rabbit/rabbit.constants';
import { RabbitPublisher } from '@core/rabbit/rabbit.publisher';
import { RABBIT_SCHEMA } from '@core/rabbit/rabbit.schema';
import { generateId } from '@utils/crypto.util';
import { ANNOUNCEMENT_MESSAGE } from './announcement.constants';
import type { Announcement } from './interfaces/announcement.interface';
import type {
  PublishAnnouncementInput,
  PublishAnnouncementResult,
} from './interfaces/publishAnnouncement.interface';

@Injectable()
export class AnnouncementService {
  constructor(private readonly rabbitPublisher: RabbitPublisher) {}

  async publish({
    message,
  }: PublishAnnouncementInput): Promise<PublishAnnouncementResult> {
    const announcement: Announcement = { id: generateId(), message };

    const { messageId, routed } = await this.rabbitPublisher.publish({
      exchange: RABBIT_SCHEMA.exchanges.broadcast.name,
      routingKey: EMPTY_ROUTING_KEY,
      type: ANNOUNCEMENT_MESSAGE,
      payload: announcement,
    });

    return { announcement, messageId, routed };
  }
}
