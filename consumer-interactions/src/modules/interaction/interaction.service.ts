import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/kafka.interface';
import type { Click, Scroll, View } from './interfaces/interaction.interface';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class InteractionService {
  private readonly logger = new Logger(InteractionService.name);

  view({ payload: view }: ConsumedMessage<View>): void {
    this.logger.log(
      `View recorded ${toLogFields({ userId: view.userId, page: view.page })}`,
    );
  }

  click({ payload: click }: ConsumedMessage<Click>): void {
    this.logger.log(
      `Click recorded ${toLogFields({
        userId: click.userId,
        page: click.page,
        element: click.element,
      })}`,
    );
  }

  scroll({ payload: scroll }: ConsumedMessage<Scroll>): void {
    this.logger.log(
      `Scroll recorded ${toLogFields({
        userId: scroll.userId,
        page: scroll.page,
        depth: `${scroll.depth}%`,
      })}`,
    );
  }
}
