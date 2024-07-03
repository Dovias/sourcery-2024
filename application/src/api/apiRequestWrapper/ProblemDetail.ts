import { AxiosError } from 'axios';
import { ProblemDetailProperty, ProblemDetailPropertyKey } from '../ProblemDetailProperty';
import { ProblemDetailPropertyList } from './ApiError';

export interface ProblemDetail {
  type: string
  title: string
  status: number
  instance: string
  detail: string
  properties?: ProblemDetailProperty
};

export const getProblemDetailDetailFromError = (error: unknown): string | undefined => {
  const axiosError = error as AxiosError<ProblemDetail>;
  return axiosError?.response?.data?.detail;
};

export const getProblemDetailPropertiesFromError = (error: unknown): ProblemDetailPropertyList => {
  const axiosError = error as AxiosError<ProblemDetail>;
  const problemDetailPropertyList: ProblemDetailPropertyList = [];

  for (const key in axiosError.response?.data.properties) {
    const propertyKey = key as ProblemDetailPropertyKey;
    problemDetailPropertyList.push([propertyKey, axiosError.response?.data.properties[propertyKey]]);
  }

  return problemDetailPropertyList;
};
