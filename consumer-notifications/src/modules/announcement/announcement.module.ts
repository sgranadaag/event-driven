import { Module } from '@nestjs/common';
import { AnnouncementConsumer } from './announcement.consumer';
import { AnnouncementService } from './announcement.service';

@Module({
  providers: [AnnouncementConsumer, AnnouncementService],
})
export class AnnouncementModule {}
