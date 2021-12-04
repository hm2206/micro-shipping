import { Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext, ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MailService } from '../application/mail.service';
import { SendMailDto, SendMailToDto } from '../domain/mail.dto';
import { microserviceConfigName } from '../../../common/configs/microservice.config';

@Controller()
export class RabbitMqController {
  constructor(
    @Inject(microserviceConfigName.PLANILLA_SERVICE)
    private client: ClientProxy,
    private mailService: MailService) {}

  public static count = 0;

  @UsePipes(new ValidationPipe({ transform: true }))
  @MessagePattern('sendMail')
  public sendMail(@Payload() payload: SendMailToDto, @Ctx() context: RmqContext): Observable<any> {
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
    // enviar evento
    const sendMailProcess = () => {
      this.client.send('sendMailProcess', payload.objectId)
      .subscribe();
    }
    // programar envio
    return new Observable(subscriber => {
      const controlTime = setTimeout(() => {
        this.mailService.sendMail(payload.email, payload as SendMailDto)
        .subscribe({
          next: (data) => {
            subscriber.next(data);
            resetTimeout(controlTime);
            // enviar email procesado
            sendMailProcess
          },
          error: (err) => {
            subscriber.error(err);
            resetTimeout(controlTime);
          }
        });
      }, interval);
    })
  }
}