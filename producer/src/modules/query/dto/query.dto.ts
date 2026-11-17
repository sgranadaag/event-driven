import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { IDENTIFIER_PATTERN } from '../query.constants';
import { QUERY_PROPERTY_SWAGGER } from '../query.swagger';

export class QueryDto {
  @ApiProperty(QUERY_PROPERTY_SWAGGER.TABLE)
  @IsString()
  @Matches(IDENTIFIER_PATTERN)
  table: string;
}
