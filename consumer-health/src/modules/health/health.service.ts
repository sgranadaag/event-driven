import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/kafka.interface';
import type {
  Cost,
  Outage,
  ThresholdBreach,
} from './interfaces/health.interface';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  outage({ payload: outage }: ConsumedMessage<Outage>): void {
    this.logger.error(
      `Service down ${toLogFields({ service: outage.service, reason: outage.reason })}`,
    );
  }

  threshold({ payload: breach }: ConsumedMessage<ThresholdBreach>): void {
    this.logger.warn(
      `Threshold exceeded ${toLogFields({
        service: breach.service,
        metric: breach.metric,
        value: breach.value,
        threshold: breach.threshold,
        exceededBy: breach.value - breach.threshold,
      })}`,
    );
  }

  cost({ payload: cost }: ConsumedMessage<Cost>): void {
    this.logger.log(
      `Cost recorded ${toLogFields({
        service: cost.service,
        amount: cost.amount,
        currency: cost.currency,
      })}`,
    );
  }
}
