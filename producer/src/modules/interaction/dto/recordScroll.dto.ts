import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { MAX_SCROLL_DEPTH, MIN_SCROLL_DEPTH } from '../interaction.constants';
import { INTERACTION_PROPERTY_SWAGGER } from '../interaction.swagger';
import { RecordViewDto } from './recordView.dto';

export class RecordScrollDto extends RecordViewDto {
  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.DEPTH)
  @IsInt()
  @Min(MIN_SCROLL_DEPTH)
  @Max(MAX_SCROLL_DEPTH)
  depth: number;
}
