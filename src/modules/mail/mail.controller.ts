import { Body, Controller, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './mail.dto';
import { CustomValidation } from 'src/common/pipes/custom-validation.pipe';
import { Response, Express } from 'express';
import { ParseErrorResponse } from 'src/common/utils/parse-error-response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post(':to/sendMail')
  @UseInterceptors(FileInterceptor('file'))
  public sendMail(@Param('to') to,
  @Res() response: Response,
  @UploadedFile() file: Express.Multer.File,
  @Body(new CustomValidation(SendMailDto)) body) {
    const result = this.mailService.sendMail(to, body, [{
      filename: file.originalname,
      content: file.buffer
    }]);
    result.subscribe({
      next: (infoMail) => response.json(infoMail),
      error: (err) => new ParseErrorResponse(err).response(response)
    });
  }
}
