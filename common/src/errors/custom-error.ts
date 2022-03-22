export abstract class CustomError extends Error{
  public httpCode: number = 400;
  abstract statusCode: number;
   
  constructor(message: string){
    super(message);
    Object.setPrototypeOf(this,CustomError.prototype);
    
    Error.captureStackTrace(this);
  }

  abstract serializeErrors():{ message: string; field?: string}[];
}