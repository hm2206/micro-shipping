import { Controller, Get,StreamableFile, Header, Query, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomValidation } from 'src/common/pipes/custom-validation.pipe';
import { MessageDto, MessageMediaDto } from './whatsapp.dto';
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

  @Get(':phoneNumber/sendMessage')
  public async sendMessage(
    @Param('phoneNumber') phoneNumber: string,
    @Query(new CustomValidation(MessageDto)) query) {
    return await this.whatsappService.sendMessage({
      phone: phoneNumber,
      ...query
    });
  } 

  @Get(':phoneNumber/sendMedia')
  public async sendMedia(
    @Param('phoneNumber') phoneNumber: string,
    @Res() response: Response,
    @Query(new CustomValidation(MessageMediaDto)) query) {
    const result = await this.whatsappService.sendMedia({ 
      phone: phoneNumber,
      ...query
    });
    // response
    result.subscribe(observer => {
      response.json(observer);
    });
  }

}
