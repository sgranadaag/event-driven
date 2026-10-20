import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/rabbit.interface';
import type { Announcement } from './interfaces/announcement.interface';

@Injectable()
export class AnnouncementService {
  private readonly logger = new Logger(AnnouncementService.name);

  receive({ queue, payload: announcement }: ConsumedMessage<Announcement>): void {
    this.logger.log(
      `Announcement ${announcement.id} copy from "${queue}": ${announcement.message}`,
    );
  }
}
