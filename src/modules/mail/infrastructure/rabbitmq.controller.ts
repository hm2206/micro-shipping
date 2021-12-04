import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MailService } from '../application/mail.service';
import { SendMailDto, SendMailToDto } from '../domain/mail.dto';

@Controller()
export class RabbitMqController {
  constructor(private mailService: MailService) {}

  public static count = 0;

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern('sendMail')
  public sendMail(@Payload() data: SendMailToDto, @Ctx() context: RmqContext): Observable<any> {
    RabbitMqController.count += 1;
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const interval = (15000) * RabbitMqController.count;
    // volver a contar
    const resetTimeout = (currentTimer) => {
      setTimeout(() => {
        RabbitMqController.count = 0;
        channel.ack(originalMsg);
        clearTimeout(currentTimer);
      }, 5000);
    }
    // programar envio
    return new Observable(subscriber => {
      const controlTime = setTimeout(() => {
        this.mailService.sendMail(data.email, data as SendMailDto)
        .subscribe({
          next: (data) => {
            console.log(data);
            subscriber.next(data);
            resetTimeout(controlTime);
          },
          error: (err) => {
            console.log(err.message)
            subscriber.error(err);
            resetTimeout(controlTime);
          }
        });
      }, interval);
    })
  }
}