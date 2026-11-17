import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { InteractionService } from './interaction.service';
import { INTERACTION_SWAGGER } from './interaction.swagger';
import { InteractionResponseDto } from './dto/interactionResponse.dto';
import { RecordClickDto } from './dto/recordClick.dto';
import { RecordScrollDto } from './dto/recordScroll.dto';
import { RecordViewDto } from './dto/recordView.dto';

@ApiTags(INTERACTION_SWAGGER.API_TAG)
@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @SwaggerDocs(INTERACTION_SWAGGER.VIEW, InteractionResponseDto)
  @Post('views')
  async view(@Body() dto: RecordViewDto): Promise<InteractionResponseDto> {
    const result = await this.interactionService.view({
      userId: dto.userId,
      page: dto.page,
    });

    return InteractionResponseDto.fromResult(result);
  }

  @SwaggerDocs(INTERACTION_SWAGGER.CLICK, InteractionResponseDto)
  @Post('clicks')
  async click(@Body() dto: RecordClickDto): Promise<InteractionResponseDto> {
    const result = await this.interactionService.click({
      userId: dto.userId,
      page: dto.page,
      element: dto.element,
    });

    return InteractionResponseDto.fromResult(result);
  }

  @SwaggerDocs(INTERACTION_SWAGGER.SCROLL, InteractionResponseDto)
  @Post('scrolls')
  async scroll(@Body() dto: RecordScrollDto): Promise<InteractionResponseDto> {
    const result = await this.interactionService.scroll({
      userId: dto.userId,
      page: dto.page,
      depth: dto.depth,
    });

    return InteractionResponseDto.fromResult(result);
  }
}
