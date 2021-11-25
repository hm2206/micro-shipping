import { IsString } from 'class-validator';
import { MessageMedia } from 'whatsapp-web.js';

export class SendMessageDto {
  @IsString()
  phone: string;

  @IsString()
  message: string | MessageMedia;
}