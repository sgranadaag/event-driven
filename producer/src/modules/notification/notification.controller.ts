import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { NotificationService } from './notification.service';
import { NOTIFICATION_SWAGGER } from './notification.swagger';
import { NotificationResponseDto } from './dto/notificationResponse.dto';
import { SendNotificationDto } from './dto/sendNotification.dto';

@ApiTags(NOTIFICATION_SWAGGER.API_TAG)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @SwaggerDocs(NOTIFICATION_SWAGGER.SEND, NotificationResponseDto)
  @Post()
  async send(@Body() dto: SendNotificationDto): Promise<NotificationResponseDto> {
    const result = await this.notificationService.send({
      channel: dto.channel,
      event: dto.event,
      message: dto.message,
    });

    return NotificationResponseDto.fromResult(result);
  }
}
