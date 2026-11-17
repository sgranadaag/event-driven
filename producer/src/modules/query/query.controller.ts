import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { QueryService } from './query.service';
import { QUERY_SWAGGER } from './query.swagger';
import { DeleteQueryDto } from './dto/deleteQuery.dto';
import { InsertQueryDto } from './dto/insertQuery.dto';
import { QueryResponseDto } from './dto/queryResponse.dto';
import { SelectQueryDto } from './dto/selectQuery.dto';

@ApiTags(QUERY_SWAGGER.API_TAG)
@Controller('queries')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @SwaggerDocs(QUERY_SWAGGER.INSERT, QueryResponseDto)
  @Post('insert')
  async insert(@Body() dto: InsertQueryDto): Promise<QueryResponseDto> {
    const result = await this.queryService.insert({
      table: dto.table,
      values: dto.values,
    });

    return QueryResponseDto.fromResult(result);
  }

  @SwaggerDocs(QUERY_SWAGGER.SELECT, QueryResponseDto)
  @Post('select')
  async select(@Body() dto: SelectQueryDto): Promise<QueryResponseDto> {
    const result = await this.queryService.select({
      table: dto.table,
      columns: dto.columns,
      where: dto.where,
    });

    return QueryResponseDto.fromResult(result);
  }

  @SwaggerDocs(QUERY_SWAGGER.DELETE, QueryResponseDto)
  @Post('delete')
  async delete(@Body() dto: DeleteQueryDto): Promise<QueryResponseDto> {
    const result = await this.queryService.delete({
      table: dto.table,
      where: dto.where,
    });

    return QueryResponseDto.fromResult(result);
  }
}
