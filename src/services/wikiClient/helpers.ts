import { type IAssertApiResponse } from './types';

const checkIsAssertError = <T extends NonNullable<unknown>>(
  apiResult: T | IAssertApiResponse,
): apiResult is IAssertApiResponse => {
  return 'error' in apiResult && !!apiResult.error?.code;
};

export { checkIsAssertError };
