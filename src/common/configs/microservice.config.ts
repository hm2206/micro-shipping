import { ClientsModule, ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

export enum microserviceConfigName {
  SHIPPING_PROCESS_SERVICE = "SHIPPING_PROCESS_SERVICE"
}

export const MicroserviceConfig = ClientsModule.registerAsync([
  {
    name: microserviceConfigName.SHIPPING_PROCESS_SERVICE,
    useFactory: () => {
      const { RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_VIRTUAL } = process.env;
      return {
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VIRTUAL}`],
          queue: 'shipping.process'
        }
      }
    }
  }
] as ClientsModuleAsyncOptions) 