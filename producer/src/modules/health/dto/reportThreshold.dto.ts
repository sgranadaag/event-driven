import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { HEALTH_PROPERTY_SWAGGER } from '../health.swagger';
import { HealthEventDto } from './healthEvent.dto';

export class ReportThresholdDto extends HealthEventDto {
  @ApiProperty(HEALTH_PROPERTY_SWAGGER.METRIC)
  @IsString()
  @IsNotEmpty()
  metric: string;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.VALUE)
  @IsNumber()
  value: number;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.THRESHOLD)
  @IsNumber()
  threshold: number;
}
