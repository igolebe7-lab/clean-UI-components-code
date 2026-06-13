export type CleanUiResult<TValue, TError = Error> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };

export const createSuccess = <TValue>(value: TValue): CleanUiResult<TValue> => ({
  ok: true,
  value,
});

export const createFailure = <TError>(error: TError): CleanUiResult<never, TError> => ({
  ok: false,
  error,
});
