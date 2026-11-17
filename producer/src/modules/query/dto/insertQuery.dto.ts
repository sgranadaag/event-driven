import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsObject } from 'class-validator';
import type { Row } from '../interfaces/query.interface';
import { QUERY_PROPERTY_SWAGGER } from '../query.swagger';
import { QueryDto } from './query.dto';

export class InsertQueryDto extends QueryDto {
  @ApiProperty(QUERY_PROPERTY_SWAGGER.VALUES)
  @IsObject()
  @IsNotEmptyObject()
  values: Row;
}
