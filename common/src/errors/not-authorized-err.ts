import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError{
  statusCode = 401;

  constructor(){
    super('Not Authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    this.httpCode = this.statusCode;
    Error.captureStackTrace(this);
  }

  serializeErrors(): { message: string; field?: string | undefined; }[] {
      return [{
        message: 'Not authorized'
      }];
  }
}