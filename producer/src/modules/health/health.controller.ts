import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { HealthService } from './health.service';
import { HEALTH_SWAGGER } from './health.swagger';
import { HealthResponseDto } from './dto/healthResponse.dto';
import { ReportCostDto } from './dto/reportCost.dto';
import { ReportOutageDto } from './dto/reportOutage.dto';
import { ReportThresholdDto } from './dto/reportThreshold.dto';

@ApiTags(HEALTH_SWAGGER.API_TAG)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @SwaggerDocs(HEALTH_SWAGGER.OUTAGE, HealthResponseDto)
  @Post('outages')
  async reportOutage(@Body() dto: ReportOutageDto): Promise<HealthResponseDto> {
    const result = await this.healthService.reportOutage({
      service: dto.service,
      reason: dto.reason,
    });

    return HealthResponseDto.fromResult(result);
  }

  @SwaggerDocs(HEALTH_SWAGGER.THRESHOLD, HealthResponseDto)
  @Post('thresholds')
  async reportThreshold(
    @Body() dto: ReportThresholdDto,
  ): Promise<HealthResponseDto> {
    const result = await this.healthService.reportThreshold({
      service: dto.service,
      metric: dto.metric,
      value: dto.value,
      threshold: dto.threshold,
    });

    return HealthResponseDto.fromResult(result);
  }

  @SwaggerDocs(HEALTH_SWAGGER.COST, HealthResponseDto)
  @Post('costs')
  async reportCost(@Body() dto: ReportCostDto): Promise<HealthResponseDto> {
    const result = await this.healthService.reportCost({
      service: dto.service,
      amount: dto.amount,
      currency: dto.currency,
    });

    return HealthResponseDto.fromResult(result);
  }
}
