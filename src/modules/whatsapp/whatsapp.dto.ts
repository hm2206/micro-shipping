import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { MessageMedia } from 'whatsapp-web.js';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  message: string | MessageMedia;
}

export class MessageMediaDto extends MessageDto {
  @IsString()
  public filename: string;

  @IsString()
  public mimeType: string;
}

export class SendMessageDto extends MessageDto{
  @IsPhoneNumber()
  public phone: string;
}

export class SendMessageMediaDto extends MessageMediaDto {
  @IsPhoneNumber()
  public phone: string;
}