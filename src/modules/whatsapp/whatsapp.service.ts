import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client, Message, MessageMedia } from 'whatsapp-web.js';
import * as qrCode from 'qrcode';
import {  SendMessageDto, SendMessageMediaDto } from './whatsapp.dto';
import { StorageManager } from '@slynova/flydrive';
import { Observable } from 'rxjs';
import { ClientHttpService } from '../client-http/client-http.service';

@Injectable()
export class WhatsappService {
  private client: Client;
  private path = 'session/wsp.json';
  private isLogged: boolean;

  constructor(
    private clientHttpService: ClientHttpService,
    private storage: StorageManager) {
    this.isLogged = false;
    this.initial();
  }
  
  public generateQrCode(): Observable<any> {
    return new Observable(subscriber => {
      try {
        if (this.isLogged) throw new InternalServerErrorException("Ya existe un usuario authenticado");
        this.client.on('qr', (qr) => {
          qrCode.toDataURL(qr, (err, url) => {
            if (err) throw new InternalServerErrorException("No se pudó generar el QR CODE");
            const parseBase64 = `${url}`.replace('data:image/png;base64,', '');
            const parseBinary = Buffer.from(parseBase64, 'base64');
            subscriber.next(parseBinary);
            subscriber.complete();
          });
        });
      } catch (error) {
        subscriber.error(error);
      }
    })
  }

  public async sendMessage({ phone, message }: SendMessageDto): Promise<Message> {
    const chatId = `${phone.replace('+', '')}@c.us`.trim();
    return await this.client.sendMessage(chatId, message)
    .then(res => res)
    .catch(() => {
      throw new InternalServerErrorException("No se pudó enviar el mensaje");
    })
  }

  public async sendMedia({ phone, message, filename, mimeType }: SendMessageMediaDto): Promise<Observable<any>> {
      const result = await this.clientHttpService.download({
        extname: 'png',
        url: `${message}`,
        dir: 'media'
      });
      // observable
      return new Observable(subscriber => {
        result.subscribe({
          next: async (infoFile) => {
            try {
              const fileBase64 = await this.storage.disk().get(infoFile.relativePath, 'base64');
              const media = new MessageMedia(mimeType, fileBase64.content, filename);
              await this.storage.disk().delete(infoFile.relativePath);
              const infoMessage = await this.sendMessage({ phone, message: media });
              subscriber.next(infoMessage);
              subscriber.complete();
            } catch (error) {
              subscriber.error(error);
            } 
          },
          error: (error) =>  subscriber.error(error)
        });
      });
  }

  private async initial() {
    const session = await this.recoverySession();
    this.client = new Client({ 
      session, 
      puppeteer: {
        executablePath: process.env.WHATSAPP_BROWSER,
        args: ['--no-sandbox'],
      },
    });
    await this.authenticate();
    this.disconnect();
    this.client.initialize();
  }

  private async authenticate(): Promise<void> {
    this.client.on('authenticated', async session => {
      this.isLogged = true;
      const parseBuffer = Buffer.from(JSON.stringify(session)).toString('base64');
      await this.storage.disk()
      .put(this.path, Buffer.from(parseBuffer, 'base64').toString('utf8'));
    });
  }

  private async recoverySession(): Promise<any> {
      const { exists } = await this.storage.disk().exists(this.path);
      if (!exists) {
        this.isLogged = false;
        return null;
      }
      // obtener archivo
      const session = await this.storage.disk().get(this.path, 'utf8');
      this.isLogged = true;
      return JSON.parse(session.content);
  }

  private disconnect() {
    this.client.on('auth_failure', () => {
      this.isLogged = false;
    });
    this.client.on('disconnected', () => {
      this.isLogged = false;
    });
  }
} 
