import { ClientsModule, ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

export enum microserviceConfigName {
  PLANILLA_SERVICE = "PLANILLA_SERVICE"
}

export const MicroserviceConfig = ClientsModule.registerAsync([
  {
    name: microserviceConfigName.PLANILLA_SERVICE,
    useFactory: () => {
      const { RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_VIRTUAL } = process.env;
      return {
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VIRTUAL}`],
          queue: 'planilla'
        }
      }
    }
  }
] as ClientsModuleAsyncOptions) 