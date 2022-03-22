import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError{
  statusCode = 400;

  public message: string;
  constructor(msg: string){
    super(msg);
    this.message = msg;
    
    Object.setPrototypeOf(this, BadRequestError.prototype);
    
    this.httpCode = this.statusCode;
    Error.captureStackTrace(this);
    
  }
  serializeErrors() {
      return [{
        message: this.message
      }];
  }
}


