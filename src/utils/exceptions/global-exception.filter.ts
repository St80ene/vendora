import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      status = exception.getStatus();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['message'] || message;
      errors = Array.isArray(errorResponse['message'])
        ? errorResponse['message']
        : null;
      errorCode = errorResponse['error'] || errorCode;
    }

    const errorResponse = {
      statusCode: status,
      message,
      errorCode,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
