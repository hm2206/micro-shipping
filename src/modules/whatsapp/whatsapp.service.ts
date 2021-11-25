import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrCode from 'qrcode';
import { SendMessageDto } from './whatsapp.dto';
import { StorageManager } from '@slynova/flydrive';

@Injectable()
export class WhatsappService {
  private client: Client;
  private path = 'session/wsp.json';
  private isLogged: boolean;

  constructor(private storage: StorageManager) {
    this.isLogged = false;
    this.initial();
  }
  
  public generateQrCode(): Promise<any> {
    if (this.isLogged) throw new InternalServerErrorException("Ya existe un usuario authenticado");
    return new Promise((resolve, reject) => {
      this.client.on('qr', (qr) => {
        qrCode.toDataURL(qr, (err, url) => {
          if (err) return reject(err);
          const parseBase64 = `${url}`.replace('data:image/png;base64,', '');
          const parseBinary = Buffer.from(parseBase64, 'base64');
          return resolve(parseBinary)
        });
      });
    });
  }

  public async sendMessage({ phone, message }: SendMessageDto): Promise<Message> {
    const chatId = `${phone.replace('+', '')}@c.us`.trim();
    return await this.client.sendMessage(chatId, message)
    .then(res => res)
    .catch(err => {
      console.log(err);
      throw new InternalServerErrorException("No se pudó enviar el mensaje");
    })
  }

  private async initial() {
    const session = await this.recoverySession();
    console.log(session);
    this.client = new Client({ 
      session, 
      puppeteer: {
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
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
