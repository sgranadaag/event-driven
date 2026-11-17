import type { Query, Row } from './query.interface';

export interface InsertInput {
  table: string;
  values: Row;
}

export interface SelectInput {
  table: string;
  columns: string[];
  where?: Row;
}

export interface DeleteInput {
  table: string;
  where: Row;
}

export interface PublishQueryResult {
  query: Query;
  messageId: string;
  partition: number;
  offset: string;
}
