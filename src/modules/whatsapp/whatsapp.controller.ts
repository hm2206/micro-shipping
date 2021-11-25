import { Controller, Get,StreamableFile, Header, Query } from '@nestjs/common';
import { CustomValidation } from 'src/common/pipes/custom-validation.pipe';
import { SendMessageDto } from './whatsapp.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private whatsappService: WhatsappService) {}

  @Get('qrCode.png')
  @Header('Content-Disposition', 'inline')
  public async authorize() {
    const qrCode = await this.whatsappService.generateQrCode();
    return new StreamableFile(qrCode);
  }

  @Get('sendMessage')
  public async setMessage(@Query(new CustomValidation(SendMessageDto)) query) {
    return await this.whatsappService.sendMessage(query);
  } 

}
