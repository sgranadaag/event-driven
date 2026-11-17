import { ApiProperty } from '@nestjs/swagger';
import type { PublishQueryResult } from '../interfaces/publishQuery.interface';
import type { QueryType } from '../interfaces/query.interface';
import { QUERY_PROPERTY_SWAGGER } from '../query.swagger';

export class QueryResponseDto {
  @ApiProperty(QUERY_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(QUERY_PROPERTY_SWAGGER.TYPE)
  readonly type: QueryType;

  @ApiProperty(QUERY_PROPERTY_SWAGGER.TABLE)
  readonly table: string;

  @ApiProperty(QUERY_PROPERTY_SWAGGER.PARTITION)
  readonly partition: number;

  @ApiProperty(QUERY_PROPERTY_SWAGGER.OFFSET)
  readonly offset: string;

  @ApiProperty(QUERY_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  private constructor(
    id: string,
    type: QueryType,
    table: string,
    partition: number,
    offset: string,
    messageId: string,
  ) {
    this.id = id;
    this.type = type;
    this.table = table;
    this.partition = partition;
    this.offset = offset;
    this.messageId = messageId;
  }

  static fromResult({
    query,
    messageId,
    partition,
    offset,
  }: PublishQueryResult): QueryResponseDto {
    return new QueryResponseDto(
      query.id,
      query.type,
      query.table,
      partition,
      offset,
      messageId,
    );
  }
}
