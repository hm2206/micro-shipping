import { Module } from '@nestjs/common';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { storageConfig } from './common/configs/storage.config';
import { StorageModule } from '@haorama/nestjs-storage';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ClientHttpModule } from './modules/client-http/client-http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.production'],
    }),
    StorageModule.forRoot(storageConfig),
    WhatsappModule, 
    MailModule, ClientHttpModule,
  ],
})
export class AppModule {}
