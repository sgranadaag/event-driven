import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HEALTH_PROPERTY_SWAGGER } from '../health.swagger';
import { HealthEventDto } from './healthEvent.dto';

export class ReportOutageDto extends HealthEventDto {
  @ApiProperty(HEALTH_PROPERTY_SWAGGER.REASON)
  @IsString()
  @IsNotEmpty()
  reason: string;
}
