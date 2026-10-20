import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ANNOUNCEMENT_PROPERTY_SWAGGER } from '../announcement.swagger';

export class PublishAnnouncementDto {
  @ApiProperty(ANNOUNCEMENT_PROPERTY_SWAGGER.MESSAGE)
  @IsString()
  @IsNotEmpty()
  message: string;
}
