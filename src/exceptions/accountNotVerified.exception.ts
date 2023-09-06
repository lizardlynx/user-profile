import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountNotVerifiedException extends HttpException {
  constructor() {
    super('Account is not verified', HttpStatus.BAD_REQUEST);
  }
}
