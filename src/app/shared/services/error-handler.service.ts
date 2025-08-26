import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


export enum ErrorType {
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    SERVER = 'SERVER',
    TIMEOUT = 'TIMEOUT'
}

export interface AppError {
    type: ErrorType;
    message: string;
    statusCode?: number;
    originalError?: any;
    timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
    handleError(error: any): AppError {
        const timestamp = new Date();
        
        // HTTP Error Response
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 400:
                    return {
                        type: ErrorType.VALIDATION,
                        message: 'Not valid data',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
                case 401:
                    return {
                        type: ErrorType.UNAUTHORIZED,
                        message: 'You are not authorized',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
                case 403:
                    return {
                        type: ErrorType.FORBIDDEN,
                        message: 'You are not allowed to do this action',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
                case 404:
                    return {
                        type: ErrorType.NOT_FOUND,
                        message: 'Resource not found',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
                case 408:
                case 504:
                    return {
                        type: ErrorType.TIMEOUT,
                        message: 'Request has expired',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
                case 500:
                case 502:
                case 503:
                    return {
                        type: ErrorType.SERVER,
                        message: 'Server error',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
                default:
                    return {
                        type: ErrorType.NETWORK,
                        message: 'Network error',
                        statusCode: error.status,
                        originalError: error,
                        timestamp
                    };
            }
        }

        // Generic error
        return {
            type: ErrorType.NETWORK,
            message: error.message || 'Došlo je do greške',
            originalError: error,
            timestamp
        };
    }

    logError(error: AppError): void {
        console.error('Application Error:', {
            type: error.type,
            message: error.message,
            statusCode: error.statusCode,
            timestamp: error.timestamp,
            originalError: error.originalError
        });
    }
}