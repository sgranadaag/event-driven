import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { AnnouncementService } from './announcement.service';
import { ANNOUNCEMENT_SWAGGER } from './announcement.swagger';
import { AnnouncementResponseDto } from './dto/announcementResponse.dto';
import { PublishAnnouncementDto } from './dto/publishAnnouncement.dto';

@ApiTags(ANNOUNCEMENT_SWAGGER.API_TAG)
@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @SwaggerDocs(ANNOUNCEMENT_SWAGGER.PUBLISH, AnnouncementResponseDto)
  @Post()
  async publish(
    @Body() dto: PublishAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    const result = await this.announcementService.publish({
      message: dto.message,
    });

    return AnnouncementResponseDto.fromResult(result);
  }
}
