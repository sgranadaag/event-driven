import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import type {
  ApiBodyOptions,
  ApiResponseCommonMetadata,
  ApiResponseOptions,
} from '@nestjs/swagger';
import type { SwaggerEndpointSchema } from '@interfaces/swaggerDocs.interface';

type SwaggerResponseType = NonNullable<ApiResponseCommonMetadata['type']>;

const LOWEST_SUCCESS_STATUS = 200;
const HIGHEST_SUCCESS_STATUS = 299;

function documentsSuccess(statusCode: number): boolean {
  return (
    statusCode >= LOWEST_SUCCESS_STATUS && statusCode <= HIGHEST_SUCCESS_STATUS
  );
}

export function SwaggerDocs(
  schema: SwaggerEndpointSchema,
  responseType?: SwaggerResponseType,
) {
  const decorators: MethodDecorator[] = [ApiOperation(schema.operation)];

  if (schema.security) {
    decorators.push(ApiSecurity(schema.security));
  }
  if (schema.consumes) {
    decorators.push(ApiConsumes(schema.consumes));
  }
  for (const param of schema.params ?? []) {
    decorators.push(ApiParam(param));
  }
  if (schema.body) {
    decorators.push(ApiBody(schema.body as ApiBodyOptions));
  }

  for (const [status, response] of Object.entries(schema.responses)) {
    const statusCode = Number(status);
    const responseOptions = response as ApiResponseOptions;
    const responseTypeField =
      responseType && documentsSuccess(statusCode) ? { type: responseType } : {};

    decorators.push(
      ApiResponse({
        status: statusCode,
        ...responseOptions,
        ...responseTypeField,
      }),
    );
  }

  return applyDecorators(...decorators);
}
