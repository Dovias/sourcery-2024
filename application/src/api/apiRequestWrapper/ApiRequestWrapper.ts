import { ApiError } from './ApiError';
import { getProblemDetailDetailFromError, getProblemDetailPropertiesFromError } from './ProblemDetail';

export const apiRequestWrapper = async <T>(apiCall: () => Promise<T>): Promise<[response: T, error: undefined] | [response: undefined, error: ApiError]> => {
  try {
    const apiValue = await apiCall();
    return [apiValue, undefined];
  }
  catch (error) {
    const apiErrorDetail = getProblemDetailDetailFromError(error);
    const apiErrorProperties = getProblemDetailPropertiesFromError(error);

    const apiError: ApiError = {
      detail: apiErrorDetail,
      properties: apiErrorProperties
    };
    return [undefined, apiError];
  }
};
