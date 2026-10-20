import { ApiProperty } from '@nestjs/swagger';
import type { SendNotificationResult } from '../interfaces/sendNotification.interface';
import { NOTIFICATION_PROPERTY_SWAGGER } from '../notification.swagger';

export class NotificationResponseDto {
  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.ROUTING_KEY)
  readonly routingKey: string;

  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.ROUTED)
  readonly routed: boolean;

  private constructor(
    id: string,
    routingKey: string,
    messageId: string,
    routed: boolean,
  ) {
    this.id = id;
    this.routingKey = routingKey;
    this.messageId = messageId;
    this.routed = routed;
  }

  static fromResult({
    notification,
    routingKey,
    messageId,
    routed,
  }: SendNotificationResult): NotificationResponseDto {
    return new NotificationResponseDto(
      notification.id,
      routingKey,
      messageId,
      routed,
    );
  }
}
