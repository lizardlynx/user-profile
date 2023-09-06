import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailException extends HttpException {
  constructor() {
    super('Error, when sending email.', HttpStatus.BAD_REQUEST);
  }
}
