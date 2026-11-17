import { Module } from '@nestjs/common';
import { QueryConsumer } from './query.consumer';
import { QueryService } from './query.service';

@Module({
  providers: [QueryConsumer, QueryService],
})
export class QueryModule {}
