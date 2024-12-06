import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dto/exception.response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status || 500;

    const responseDto = new ResponseDto(
      status,
      exception.message || 'Internal server error',
    );

    response.status(status).json(responseDto);
  }
}
