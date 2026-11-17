import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Event-driven producer')
    .setDescription(
      'Publishes events to three Kafka topics: `interactions` (views, clicks ' +
        'and scrolls, one partition per kind), `db-queries` (insert, select ' +
        'and delete, partitioned by table) and `service-health` (outages, ' +
        'exceeded thresholds and costs, partitioned by service). Every ' +
        'response says which partition the event was written to and at ' +
        'which offset.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}
