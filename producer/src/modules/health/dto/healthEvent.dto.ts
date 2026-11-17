import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { SERVICE_NAME_PATTERN } from '../health.constants';
import { HEALTH_PROPERTY_SWAGGER } from '../health.swagger';

export class HealthEventDto {
  @ApiProperty(HEALTH_PROPERTY_SWAGGER.SERVICE)
  @IsString()
  @Matches(SERVICE_NAME_PATTERN)
  service: string;
}
