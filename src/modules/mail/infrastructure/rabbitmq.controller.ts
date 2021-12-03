import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { MailService } from '../application/mail.service';
import { SendMailDto, SendMailToDto } from '../domain/mail.dto';

@Controller()
export class RabbitMqController {
  constructor(private mailService: MailService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern('sendMail')
  sendMail(@Payload() data: SendMailToDto, @Ctx() context: RmqContext): any {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const result = this.mailService.sendMail(data.email, {
      subject: data.subject,
      content: data.content
    } as SendMailDto);
    // subscriber
    return result.subscribe({
      next: (data) => {
        channel.ack(originalMsg);
        return data;
      },
      error: (err) => {
        channel.ack(originalMsg);
        return err
      }
    })
  }
}