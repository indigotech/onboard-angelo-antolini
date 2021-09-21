import { ApolloError } from 'apollo-server';

export class CustomError extends Error {
  code: number;
  additionalInfo?: string;
  name: string;

  constructor(message: string, code: number, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
    this.name = 'CustomError';
  }
}

export function formatError(error: ApolloError) {
  const originalError = error.originalError as CustomError;

  if (originalError?.name === 'CustomError') {
    return {
      ...error,
      message: originalError.message,
      code: originalError.code,
      additionalInfo: originalError.additionalInfo,
    };
  } else {
    return {
      ...error,
      message: 'Erro inesperado',
      additionalInfo: error.message,
    };
  }
}
