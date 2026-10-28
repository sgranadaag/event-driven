import { ConfigService } from '@nestjs/config';
import { ENV } from '@constants/environment.constant';
import type { RabbitConfig } from '@interfaces/rabbit.interface';

export function rabbitConfig(configService: ConfigService): RabbitConfig {
  return {
    url: configService.getOrThrow<string>(ENV.RABBIT_URL),
    notificationChannel: configService.getOrThrow<string>(ENV.NOTIFICATION_CHANNEL),
  };
}
