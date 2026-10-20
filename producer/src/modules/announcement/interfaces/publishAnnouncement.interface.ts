import type { Announcement } from './announcement.interface';

export interface PublishAnnouncementInput {
  message: string;
}

export interface PublishAnnouncementResult {
  announcement: Announcement;
  messageId: string;
  routed: boolean;
}
