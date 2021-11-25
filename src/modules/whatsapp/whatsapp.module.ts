import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
  imports: [HttpModule.register({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })],
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [WhatsappService],
})
export class WhatsappModule {}
