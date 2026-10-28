import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitSubscriber } from '@core/rabbit/rabbit.subscriber';
import { ANNOUNCEMENT_MESSAGE } from './announcement.constants';
import { AnnouncementService } from './announcement.service';
import type { Announcement } from './interfaces/announcement.interface';

@Injectable()
export class AnnouncementConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitSubscriber: RabbitSubscriber,
    private readonly announcementService: AnnouncementService,
  ) {}

  onModuleInit(): void {
    this.rabbitSubscriber.subscribe<Announcement>(ANNOUNCEMENT_MESSAGE, (message) =>
      this.announcementService.receive(message),
    );
  }
}
