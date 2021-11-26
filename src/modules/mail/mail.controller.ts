import { Controller, Param, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './mail.dto';
import { CustomValidation } from 'src/common/pipes/custom-validation.pipe';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post(':to/sendMail')
  public sendMail(@Param('to') to,
  @Query(new CustomValidation(SendMailDto)) query) {
    return this.mailService.sendMail(to, query);
  }
}
