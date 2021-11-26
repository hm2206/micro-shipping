import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendMail(email: string, payload: SendMailDto) {
    await this.mailerService.sendMail({
      to: email,
      subject: payload.subject,
      template: './default',
      context: {
        subject: payload.subject,
        content: payload.content,
      }
    });
  }
}
