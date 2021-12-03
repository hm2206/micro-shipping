import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const SENT_MAIL = {
  transport: Transport.RMQ,
  options: {
    urls: [`amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
    queue: 'shipping',
    noAck: false
  }
} as MicroserviceOptions