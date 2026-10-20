import { ApiProperty } from '@nestjs/swagger';
import type { PublishAnnouncementResult } from '../interfaces/publishAnnouncement.interface';
import { ANNOUNCEMENT_PROPERTY_SWAGGER } from '../announcement.swagger';

export class AnnouncementResponseDto {
  @ApiProperty(ANNOUNCEMENT_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(ANNOUNCEMENT_PROPERTY_SWAGGER.MESSAGE)
  readonly message: string;

  @ApiProperty(ANNOUNCEMENT_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  @ApiProperty(ANNOUNCEMENT_PROPERTY_SWAGGER.ROUTED)
  readonly routed: boolean;

  private constructor(
    id: string,
    message: string,
    messageId: string,
    routed: boolean,
  ) {
    this.id = id;
    this.message = message;
    this.messageId = messageId;
    this.routed = routed;
  }

  static fromResult({
    announcement,
    messageId,
    routed,
  }: PublishAnnouncementResult): AnnouncementResponseDto {
    return new AnnouncementResponseDto(
      announcement.id,
      announcement.message,
      messageId,
      routed,
    );
  }
}
