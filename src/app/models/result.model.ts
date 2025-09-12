export interface SuccessResult<T> {
  isSuccess: true;
  value: T;
}

export interface FailureResult {
  isSuccess: false;
  error: string;
}

export type Result<T> = SuccessResult<T> | FailureResult;
