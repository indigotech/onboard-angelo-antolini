import { ApolloError } from 'apollo-server';

export class CustomError extends Error {
  code: number;
  additionalInfo?: string;
  originalError: any;

  constructor(message: string, code: number, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}

export function formatError(error: CustomError) {
  const originalError = error.originalError;
  return {
    error,
  };
}
