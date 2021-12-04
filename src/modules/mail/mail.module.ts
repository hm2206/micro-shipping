import { Module } from '@nestjs/common';
import { MailService } from './application/mail.service';
import { HttpController } from './infrastructure/http.controller';
import { ClientHttpModule } from '../client-http/client-http.module';
import { MailConfig } from './application/mail.config';
import { RabbitMqController } from './infrastructure/rabbitmq.controller';
import { MicroserviceConfig } from '../../common/configs/microservice.config';

@Module({
  imports: [
    MicroserviceConfig,
    MailConfig,
    ClientHttpModule,
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [HttpController, RabbitMqController],
})
export class MailModule {}
