import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/kafka.interface';
import type {
  DeleteQuery,
  InsertQuery,
  SelectQuery,
} from './interfaces/query.interface';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class QueryService {
  private readonly logger = new Logger(QueryService.name);

  insert({ payload: query }: ConsumedMessage<InsertQuery>): void {
    this.logger.log(
      `Query executed ${toLogFields({
        type: query.type,
        table: query.table,
        values: JSON.stringify(query.payload.values),
      })}`,
    );
  }

  select({ payload: query }: ConsumedMessage<SelectQuery>): void {
    this.logger.log(
      `Query executed ${toLogFields({
        type: query.type,
        table: query.table,
        columns: query.payload.columns.join(','),
        where: JSON.stringify(query.payload.where),
      })}`,
    );
  }

  delete({ payload: query }: ConsumedMessage<DeleteQuery>): void {
    this.logger.log(
      `Query executed ${toLogFields({
        type: query.type,
        table: query.table,
        where: JSON.stringify(query.payload.where),
      })}`,
    );
  }
}
