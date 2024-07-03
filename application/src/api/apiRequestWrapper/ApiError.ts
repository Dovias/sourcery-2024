import { ProblemDetailPropertyKey } from '../ProblemDetailProperty';

export type ProblemDetailPropertyList = [ProblemDetailPropertyKey, string][];

export interface ApiError {
  detail?: string
  properties: ProblemDetailPropertyList
}
