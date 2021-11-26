import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './mail.dto';
import { Observable } from 'rxjs';
import { Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public sendMail(email: string, payload: SendMailDto, attachments?: Attachment[]): Observable<any> {
    return new Observable(subscriber => {
      try {
        this.mailerService.sendMail({
          to: email,
          subject: payload.subject,
          template: './default',
          attachments: attachments as any,
          context: {
            subject: payload.subject,
            content: payload.content,
          }
        })
        .then(infoMail => {
          subscriber.next(infoMail)
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        })
      } catch (error) {
        subscriber.error(error);
      }
    });
  }
}
