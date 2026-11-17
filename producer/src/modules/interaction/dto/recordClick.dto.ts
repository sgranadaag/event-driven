import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { INTERACTION_PROPERTY_SWAGGER } from '../interaction.swagger';
import { RecordViewDto } from './recordView.dto';

export class RecordClickDto extends RecordViewDto {
  @ApiProperty(INTERACTION_PROPERTY_SWAGGER.ELEMENT)
  @IsString()
  @IsNotEmpty()
  element: string;
}
