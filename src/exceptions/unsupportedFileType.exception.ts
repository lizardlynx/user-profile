import { HttpException, HttpStatus } from '@nestjs/common';

export class UnsupportedFileTypeException extends HttpException {
  constructor() {
    super('Such file type is not supported', HttpStatus.BAD_REQUEST);
  }
}
