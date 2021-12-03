import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { resolve } from 'path';

export const MailConfig = MailerModule.forRootAsync({
  useFactory: () => ({
    transport: {
      host: process.env.SMTP_HOST,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    defaults: {
      from: process.env.STMP_FROM,
    },
    template: {
      dir: resolve(__dirname, '../templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      }
    }
  } as MailerOptions)
});