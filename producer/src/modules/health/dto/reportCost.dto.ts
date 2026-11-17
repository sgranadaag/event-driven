import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Matches, Min } from 'class-validator';
import { CURRENCY_CODE_PATTERN, MIN_COST_AMOUNT } from '../health.constants';
import { HEALTH_PROPERTY_SWAGGER } from '../health.swagger';
import { HealthEventDto } from './healthEvent.dto';

export class ReportCostDto extends HealthEventDto {
  @ApiProperty(HEALTH_PROPERTY_SWAGGER.AMOUNT)
  @IsNumber()
  @Min(MIN_COST_AMOUNT)
  amount: number;

  @ApiProperty(HEALTH_PROPERTY_SWAGGER.CURRENCY)
  @Matches(CURRENCY_CODE_PATTERN)
  currency: string;
}
