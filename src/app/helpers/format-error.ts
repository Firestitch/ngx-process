import { HttpErrorResponse } from '@angular/common/http';

import { IProcessError, IProcessException } from '../interfaces/process-error';


interface TraceFrame {
  call: string;
  file: string;
  line: string;
}

/**
 * One entry of an api trace: a call, the file it ran in, and the line —
 * `Framework/Db/Engine/Engine->queries() on /app/framework/Upgrade.php @ 49`.
 *
 * Anything without that shape is not a frame. A system exception has a debug
 * dump prepended to its trace — the failing query, the payload of the operation
 * that broke — and that is free text over several lines, which this cannot match
 * because `.` stops at a newline.
 */
const FRAME = /^(.*?)\s+(?:in|on)\s+(.*?)\s*@\s*(\d*)\s*$/;

/**
 * Everything a failed process knows about why it failed, taken apart for its log.
 *
 * The dock shows one line — the server's message — which is enough to know that
 * something broke and never enough to know what. The rest of the failure is
 * already in hand: outside production the api envelope carries the exception
 * class, its code, its trace, and the exception that caused it. It used to be
 * dropped on the floor, so the only way to read it was the network tab.
 *
 * Whatever does not carry an envelope — a gateway error page, a dropped
 * connection, a string thrown by hand — degrades to whatever it does carry.
 */
export function formatError(error: any): IProcessError {
  const payload = error instanceof HttpErrorResponse ? error.error : error;

  // A body that could not be parsed as json arrives as the raw text it was
  if (typeof payload === 'string') {
    return { text: payload.trim() };
  }

  const result: IProcessError = {};
  const message = payload?.message ||
    (error instanceof HttpErrorResponse ? error.statusText : error?.message);

  if (error instanceof HttpErrorResponse) {
    result.status = `${error.status}`;
    result.url = error.url || '';
  }

  if (payload?.exception) {
    result.exceptions = _exceptions(payload.exception, message);
  } else if (error?.stack) {
    result.text = `${error.stack}`.trim();
  }

  if (!result.status && !result.exceptions?.length && !result.text) {
    result.text = _stringify(error);
  }

  return result;
}

function _exceptions(exception: any, shown: string, caption = ''): IProcessException[] {
  return [
    {
      caption,
      class: exception.class || 'Exception',
      code: exception.code ? `${exception.code}` : '',

      // The top of the envelope already carries the message of the outermost
      // exception — repeating it here says nothing. A cause carries its own
      message: exception.message === shown ? '' : exception.message || '',
      ..._trace(exception.trace),
    },
    ...(exception.previous ? _exceptions(exception.previous, shown, 'Caused by') : []),
  ];
}

function _trace(trace: any): Pick<IProcessException, 'dumps' | 'root' | 'frames'> {
  const dumps: string[] = [];
  const parsed: TraceFrame[] = [];

  (Array.isArray(trace) ? trace : [])
    .forEach((entry) => {
      const frame = _parseFrame(entry);

      if (frame) {
        parsed.push(frame);
      } else if (`${entry}`.trim()) {
        // A debug dump rather than a frame, and usually the answer — it is the
        // statement or the payload that broke. Kept whole and kept above the trace
        dumps.push(`${entry}`.trim());
      }
    });

  // Every frame of a php trace is an absolute path on the server, and the part
  // that differs — the file inside the project — is the tail. Stating the shared
  // root once keeps each frame to a line instead of wrapping it over two
  const root = _commonRoot(parsed);

  const frames = parsed
    .map((frame, index) => {
      const location = frame.file ?
        `${frame.file.substring(root.length)}(${frame.line || '?'})` :
        '[internal function]';

      return `#${index} ${location}: ${frame.call}`;
    });

  return { dumps, root, frames };
}

function _parseFrame(entry: any): TraceFrame {
  const match = typeof entry === 'string' ? entry.match(FRAME) : null;

  if (!match) {
    return null;
  }

  return {
    call: match[1],
    file: match[2],
    line: match[3],
  };
}

function _commonRoot(frames: TraceFrame[]): string {
  const files = frames
    .map((frame) => frame.file)
    .filter((file) => !!file);

  if (files.length < 2) {
    return '';
  }

  let root = files[0];

  files
    .forEach((file) => {
      let index = 0;

      while (index < root.length && root[index] === file[index]) {
        index++;
      }

      root = root.substring(0, index);
    });

  // Cut back to a directory boundary so half a filename is never called a root
  root = root.substring(0, root.lastIndexOf('/') + 1);

  return root.length > 1 ? root : '';
}

function _stringify(error: any): string {
  try {
    return JSON.stringify(error, null, 2);
  } catch (e) {
    return String(error);
  }
}
