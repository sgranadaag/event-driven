import { ApiProperty } from '@nestjs/swagger';
import type { PublishInteractionResult } from '../interfaces/publishInteraction.interface';
import { INTERACTION_PROPERTY_SWAGGER } from '../interaction.swagger';

export class InteractionResponseDto {
  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.USER_ID)
  readonly userId: string;

  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.PAGE)
  readonly page: string;

  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.PARTITION)
  readonly partition: number;

  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.OFFSET)
  readonly offset: string;

  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  private constructor(
    id: string,
    userId: string,
    page: string,
    partition: number,
    offset: string,
    messageId: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.page = page;
    this.partition = partition;
    this.offset = offset;
    this.messageId = messageId;
  }

  static fromResult({
    interaction,
    messageId,
    partition,
    offset,
  }: PublishInteractionResult): InteractionResponseDto {
    return new InteractionResponseDto(
      interaction.id,
      interaction.userId,
      interaction.page,
      partition,
      offset,
      messageId,
    );
  }
}
