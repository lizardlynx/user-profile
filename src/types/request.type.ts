import { Request } from 'express';
export interface IUserAuthRequest extends Request {
  user: Record<string, string>;
}
