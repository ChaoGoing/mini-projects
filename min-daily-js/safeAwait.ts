export type SafeAwaitResult<T> = [true, null, T] | [false, Error, null];

export async function safeAwait<T>(
  promise: Promise<T>
): Promise<SafeAwaitResult<T>> {
  try {
    const result = await promise;
    return [true, null, result];
  } catch (err: any) {
    const error = err instanceof Error ? err : new Error(String(err));
    return [false, error, null];
  }
}
