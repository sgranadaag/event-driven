import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsObject,
  IsOptional,
  Matches,
} from 'class-validator';
import type { Row } from '../interfaces/query.interface';
import { IDENTIFIER_PATTERN } from '../query.constants';
import { QUERY_PROPERTY_SWAGGER } from '../query.swagger';
import { QueryDto } from './query.dto';

export class SelectQueryDto extends QueryDto {
  @ApiProperty(QUERY_PROPERTY_SWAGGER.COLUMNS)
  @IsArray()
  @ArrayNotEmpty()
  @Matches(IDENTIFIER_PATTERN, { each: true })
  columns: string[];

  @ApiPropertyOptional(QUERY_PROPERTY_SWAGGER.SELECT_WHERE)
  @IsOptional()
  @IsObject()
  where?: Row;
}
