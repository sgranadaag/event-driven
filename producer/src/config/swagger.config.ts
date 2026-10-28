import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Event-driven producer')
    .setDescription(
      'Publishes messages to RabbitMQ through its four exchange types: direct ' +
        '(orders), headers (order priority), topic (notifications) and fanout ' +
        '(announcements). It always publishes to an exchange, never to a ' +
        'queue, and every response says whether the exchange routed the ' +
        'message to at least one queue.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}
