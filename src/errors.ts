import { GraphQLError } from 'graphql';

export class CustomError extends Error {
  code: number;
  additionalInfo?: string;

  constructor(message: string, code: number, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}

export function formatError(error: GraphQLError) {
  const originalError = error.originalError as CustomError;
  const newError = {
    ...error,
    message: originalError.message,
    code: originalError.code,
    additionalInfo: originalError.additionalInfo,
  };
  return newError;
}
