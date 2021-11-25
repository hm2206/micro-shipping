import { Module } from '@nestjs/common';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { StorageConfig } from './common/configs/storage.config';

@Module({
  imports: [
    WhatsappModule, 
    StorageConfig,
  ],
})
export class AppModule {}
