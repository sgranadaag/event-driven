import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaSubscriber } from '@core/kafka/kafka.subscriber';
import {
  QUERY_DELETE_MESSAGE,
  QUERY_INSERT_MESSAGE,
  QUERY_SELECT_MESSAGE,
} from './query.constants';
import { QueryService } from './query.service';
import type {
  DeleteQuery,
  InsertQuery,
  SelectQuery,
} from './interfaces/query.interface';

@Injectable()
export class QueryConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaSubscriber: KafkaSubscriber,
    private readonly queryService: QueryService,
  ) {}

  onModuleInit(): void {
    this.kafkaSubscriber.subscribe<InsertQuery>(QUERY_INSERT_MESSAGE, (message) =>
      this.queryService.insert(message),
    );
    this.kafkaSubscriber.subscribe<SelectQuery>(QUERY_SELECT_MESSAGE, (message) =>
      this.queryService.select(message),
    );
    this.kafkaSubscriber.subscribe<DeleteQuery>(QUERY_DELETE_MESSAGE, (message) =>
      this.queryService.delete(message),
    );
  }
}
