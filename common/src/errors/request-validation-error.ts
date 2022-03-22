import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError{
  statusCode = 400;
  //private means assign errors to class member errors
  public errors: ValidationError[];
  
  constructor(errors: ValidationError[]){
    super('request param invalid');
    this.errors = errors;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
    this.httpCode = this.statusCode;
    Error.captureStackTrace(this);
  }

  serializeErrors(){
    return this.errors.map( err => {
      return{
        message: err.msg,
        field: err.param
      }
    })
  }
}

