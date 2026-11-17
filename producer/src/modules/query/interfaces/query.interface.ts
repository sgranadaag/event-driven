export type Row = Record<string, unknown>;

export type QueryType = 'insert' | 'select' | 'delete';

export interface InsertPayload {
  values: Row;
}

export interface SelectPayload {
  columns: string[];
  where: Row;
}

export interface DeletePayload {
  where: Row;
}

export interface Query<Payload = InsertPayload | SelectPayload | DeletePayload> {
  id: string;
  type: QueryType;
  table: string;
  payload: Payload;
}

export type InsertQuery = Query<InsertPayload>;

export type SelectQuery = Query<SelectPayload>;

export type DeleteQuery = Query<DeletePayload>;
