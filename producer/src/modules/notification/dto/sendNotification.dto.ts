import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ROUTING_KEY_WORD_PATTERN } from '../notification.constants';
import { NOTIFICATION_PROPERTY_SWAGGER } from '../notification.swagger';

export class SendNotificationDto {
  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.CHANNEL)
  @IsString()
  @Matches(ROUTING_KEY_WORD_PATTERN)
  channel: string;

  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.EVENT)
  @IsString()
  @Matches(ROUTING_KEY_WORD_PATTERN)
  event: string;

  @ApiProperty(NOTIFICATION_PROPERTY_SWAGGER.MESSAGE)
  @IsString()
  @IsNotEmpty()
  message: string;
}
