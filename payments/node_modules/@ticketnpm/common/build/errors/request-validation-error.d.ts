import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export declare class RequestValidationError extends CustomError {
    statusCode: number;
    errors: ValidationError[];
    constructor(errors: ValidationError[]);
    serializeErrors(): {
        message: any;
        field: string;
    }[];
}
