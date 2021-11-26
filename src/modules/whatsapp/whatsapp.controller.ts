import { Controller, Get, Header, Query, Param, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { CustomValidation } from 'src/common/pipes/custom-validation.pipe';
import { ParseErrorResponse } from 'src/common/utils/parse-error-response';
import { MessageDto, MessageMediaDto } from './whatsapp.dto';
import { WhatsappService } from './whatsapp.service';
import { ParseBufferToReable } from 'src/common/utils/parse-buffer-to-reable'

@Controller('whatsapp')
export class WhatsappController {
  constructor(private whatsappService: WhatsappService) {}

  @Get('qrCode.png')
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'inline')
  public authorize(@Res() response: Response) {
    const result = this.whatsappService.generateQrCode();
    result.subscribe({
      next: (qr: Buffer) => {
        const stream = ParseBufferToReable.toStream(qr);
        stream.pipe(response);
      },
      error: (err) => new ParseErrorResponse(err).response(response)
    })
  }

  @Post(':phoneNumber/sendMessage')
  public async sendMessage(
    @Param('phoneNumber') phoneNumber: string,
    @Query(new CustomValidation(MessageDto)) query) {
    return await this.whatsappService.sendMessage({
      phone: phoneNumber,
      ...query
    });
  } 

  @Post(':phoneNumber/sendMedia')
  public async sendMedia(
    @Param('phoneNumber') phoneNumber: string,
    @Res() response: Response,
    @Query(new CustomValidation(MessageMediaDto)) query) {
    const result = await this.whatsappService.sendMedia({ 
      phone: phoneNumber,
      ...query
    });
    // response
    result.subscribe({
      next: (infoMessage) => response.json(infoMessage),
      error: (error) => new ParseErrorResponse(error).response(response)
    });
  }
}
