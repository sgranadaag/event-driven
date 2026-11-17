import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { INTERACTION_PROPERTY_SWAGGER } from '../interaction.swagger';

export class RecordViewDto {
  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.USER_ID)
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.PAGE)
  @IsString()
  @IsNotEmpty()
  page: string;
}
