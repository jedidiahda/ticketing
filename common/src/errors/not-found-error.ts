import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError{
  statusCode = 404;

  constructor(){
    super('Route not found');
    Object.setPrototypeOf(this,NotFoundError.prototype);
    this.httpCode = this.statusCode;
    Error.captureStackTrace(this);
  }

  serializeErrors(): { message: string; field?: string | undefined; }[] {
    return [{message:'Not Found'}];
  }
  
  
}