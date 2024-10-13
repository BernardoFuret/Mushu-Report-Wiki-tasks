import { type IApiErrorResponse } from './types';

const checkIsApiError = <T extends NonNullable<unknown>>(
  apiResult: T | IApiErrorResponse,
): apiResult is IApiErrorResponse => {
  return 'error' in apiResult && !!apiResult.error?.code;
};

export { checkIsApiError };
