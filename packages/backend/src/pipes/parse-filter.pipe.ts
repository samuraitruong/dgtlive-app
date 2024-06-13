/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseFilterPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    try {
      return value ? JSON.parse(value) : {};
    } catch (error) {
      throw new BadRequestException('Invalid filter format');
    }
  }
}
