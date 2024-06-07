import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Catch(NotFoundException)
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const { url } = ctx.getRequest();
        // Serve your static file here
        const staticFilePath = path.join(__dirname, '../../..', 'frontend/out/tournament/default.html');
        // Check if the file exists
        if (url.includes('/tournament') && fs.existsSync(staticFilePath)) {
            response.sendFile(staticFilePath);
        } else {
            // If file doesn't exist, send a simple message
            response.status(404).json({
                message: 'Page Not Found',
            });
        }
    }
}