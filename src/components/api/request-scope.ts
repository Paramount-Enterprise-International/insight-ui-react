import { normalizeApiError } from './api-error';

/** Creates the normalized transport error used for aborts and timeouts. */
export function requestCancellation(kind: 'abort' | 'timeout') {
  return normalizeApiError({
    status: 0,
    name: kind === 'timeout' ? 'TimeoutError' : 'AbortError',
    errorCode: kind === 'timeout' ? 'REQUEST_TIMEOUT' : 'REQUEST_ABORTED',
    message: kind === 'timeout' ? 'Request timed out' : 'Request aborted',
  });
}

/** Own a request deadline and detach cancellation listeners when the call settles. */
export function createRequestScope(
  timeoutMs = 60_000,
  signals: (AbortSignal | undefined)[] = []
) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeoutMs must be a positive finite number.');
  }
  const controller = new AbortController();
  const abort = () => controller.abort(requestCancellation('abort'));
  const timer = setTimeout(
    () => controller.abort(requestCancellation('timeout')),
    timeoutMs
  );
  for (const signal of signals) {
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
  }
  return {
    signal: controller.signal,
    dispose() {
      clearTimeout(timer);
      signals.forEach((signal) => signal?.removeEventListener('abort', abort));
    },
  };
}

/** Cancel only this waiter, leaving an application's shared refresh running. */
export function waitForRequest<T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      signal.removeEventListener('abort', abort);
      reject(signal.reason ?? requestCancellation('abort'));
    };
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener('abort', abort));
  });
}
