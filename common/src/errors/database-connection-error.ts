
import { CustomError } from "./custom-error";
export class DatabaseConnectionError extends CustomError{
  reason = 'Error connecting to database';
  statusCode = 500;
  constructor(){
    super('Error db connection');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    this.httpCode = this.statusCode;
    Error.captureStackTrace(this);
  }

  serializeErrors(){
    return [
      {
        message: this.reason
      }
    ]
  }
}