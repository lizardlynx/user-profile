import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginExistsException extends HttpException {
  constructor() {
    super('Such Login Already Exists', HttpStatus.BAD_REQUEST);
  }
}
