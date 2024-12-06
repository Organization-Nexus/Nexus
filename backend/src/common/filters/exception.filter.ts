import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dto/exception.response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const responseDto = new ResponseDto(
      status,
      typeof errorResponse === 'string'
        ? errorResponse
        : errorResponse['message'],
    );

    response.status(status).json(responseDto);
  }
}
