/**
 * Discriminated Union Result pattern for industrial-grade error handling.
 * Inspired by Rust's Result type and Kota Skillz patterns.
 */

export type Result<T, E = Error> = 
  | { ok: true; value: T } 
  | { ok: false; error: E };

/**
 * Creates a successful result.
 */
export const Ok = <T, E = Error>(value: T): Result<T, E> => ({
  ok: true,
  value,
});

/**
 * Creates an error result.
 */
export const Err = <T, E = Error>(error: E): Result<T, E> => ({
  ok: false,
  error,
});

/**
 * Type guard for successful results.
 */
export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } => {
  return result.ok;
};

/**
 * Type guard for error results.
 */
export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } => {
  return !result.ok;
};

/**
 * Wraps an async function to return a Result.
 */
export const wrapAsync = async <T, E = Error>(
  promise: Promise<T>,
  errorHandler?: (err: any) => E
): Promise<Result<T, E>> => {
  try {
    const value = await promise;
    return Ok(value);
  } catch (error) {
    return Err(errorHandler ? errorHandler(error) : (error as E));
  }
};
