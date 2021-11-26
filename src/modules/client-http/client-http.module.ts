import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientHttpService } from './client-http.service';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
  ],
  providers: [ClientHttpService],
  exports: [ClientHttpService],
})
export class ClientHttpModule {}
