import { HttpErrorResponse } from '@angular/common/http';


/**
 * The one line a failure gets to say for itself — the dock has room for nothing
 * else, and it is the caption above the log.
 *
 * The server's own message is preferred whenever the body carried one. What it
 * must never fall back to is `statusText`: HTTP/2 carries no reason phrase, so
 * `xhr.statusText` is an empty string for every response over it, and Angular's
 * HttpXhrBackend substitutes the literal `'OK'` (`xhr.statusText || 'OK'`). That
 * turned a 504 into `Downloading PDF: OK` — a failure reading as a success.
 * Angular's fallback cannot be changed, so the status code is stated instead.
 */
export function errorMessage(error: any): string {
  if (error instanceof HttpErrorResponse) {
    // A gateway error page is a string body, and carries no message of its own
    const message = typeof error.error === 'string' ? '' : error.error?.message;

    if (message) {
      return message;
    }

    return error.statusText && error.statusText !== 'OK' ?
      error.statusText :
      `${error.status}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  return error?.message || '';
}
