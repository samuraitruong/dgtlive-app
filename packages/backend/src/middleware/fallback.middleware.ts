/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FallbackMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, _next: NextFunction) {
    res.sendFile(
      join(__dirname, '../..', 'frontend/out/tournament/default.html'),
    );
  }
}
