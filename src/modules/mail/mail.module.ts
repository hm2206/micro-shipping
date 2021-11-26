import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ClientHttpModule } from '../client-http/client-http.module';
import { MailConfig } from './mail.config';

@Module({
  imports: [
    MailConfig,
    ClientHttpModule,
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
