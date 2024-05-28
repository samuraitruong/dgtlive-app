import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class SocketExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    if (exception instanceof WsException) {
      client.error(exception.getError());
    } else {
      client.error('Internal server error');
    }
  }
}
