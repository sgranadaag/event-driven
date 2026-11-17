import { ApiProperty } from '@nestjs/swagger';
import type { PublishHealthResult } from '../interfaces/publishHealth.interface';
import { HEALTH_PROPERTY_SWAGGER } from '../health.swagger';

export class HealthResponseDto {
  @ApiProperty(HEALTH_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.SERVICE)
  readonly service: string;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.PARTITION)
  readonly partition: number;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.OFFSET)
  readonly offset: string;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  private constructor(
    id: string,
    service: string,
    partition: number,
    offset: string,
    messageId: string,
  ) {
    this.id = id;
    this.service = service;
    this.partition = partition;
    this.offset = offset;
    this.messageId = messageId;
  }

  static fromResult({
    healthEvent,
    messageId,
    partition,
    offset,
  }: PublishHealthResult): HealthResponseDto {
    return new HealthResponseDto(
      healthEvent.id,
      healthEvent.service,
      partition,
      offset,
      messageId,
    );
  }
}
