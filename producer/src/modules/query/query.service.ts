import { Injectable } from '@nestjs/common';
import { KafkaPublisher } from '@core/kafka/kafka.publisher';
import { KAFKA_SCHEMA } from '@core/kafka/kafka.schema';
import { generateId } from '@utils/crypto.util';
import {
  QUERY_DELETE_MESSAGE,
  QUERY_INSERT_MESSAGE,
  QUERY_SELECT_MESSAGE,
} from './query.constants';
import type {
  DeleteQuery,
  InsertQuery,
  Query,
  SelectQuery,
} from './interfaces/query.interface';
import type {
  DeleteInput,
  InsertInput,
  PublishQueryResult,
  SelectInput,
} from './interfaces/publishQuery.interface';

@Injectable()
export class QueryService {
  constructor(private readonly kafkaPublisher: KafkaPublisher) {}

  insert({ table, values }: InsertInput): Promise<PublishQueryResult> {
    const query: InsertQuery = {
      id: generateId(),
      type: 'insert',
      table,
      payload: { values },
    };

    return this.publish(QUERY_INSERT_MESSAGE, query);
  }

  select({ table, columns, where = {} }: SelectInput): Promise<PublishQueryResult> {
    const query: SelectQuery = {
      id: generateId(),
      type: 'select',
      table,
      payload: { columns, where },
    };

    return this.publish(QUERY_SELECT_MESSAGE, query);
  }

  delete({ table, where }: DeleteInput): Promise<PublishQueryResult> {
    const query: DeleteQuery = {
      id: generateId(),
      type: 'delete',
      table,
      payload: { where },
    };

    return this.publish(QUERY_DELETE_MESSAGE, query);
  }

  private async publish(type: string, query: Query): Promise<PublishQueryResult> {
    const result = await this.kafkaPublisher.publish({
      topic: KAFKA_SCHEMA.topics.queries.name,
      type,
      key: query.table,
      payload: query,
    });

    return { query, ...result };
  }
}
