import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ParamsException, ParseErrorResponse } from '../utils/parse-error-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ParamsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const result = new ParseErrorResponse(exception);
    result.response(response);
  }
}
