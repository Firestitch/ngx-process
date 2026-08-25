/**
 * A failure taken apart into the pieces that answer different questions: what
 * was requested, what was thrown, and where it was thrown from.
 *
 * They are kept apart rather than joined into one block of text because a log
 * that shows them as one block reads as one block — the status, the class and
 * the message disappear into the trace they sit next to, and the trace is the
 * part that matters least.
 */
export interface IProcessError {
  status?: string;
  url?: string;
  exceptions?: IProcessException[];

  // Whatever carried no structure to take apart — a gateway error page, a
  // javascript stack, a string thrown by hand
  text?: string;
}

export interface IProcessException {
  // 'Caused by', for an exception that is the reason for the one above it
  caption?: string;
  class?: string;
  code?: string;
  message?: string;

  // Debug output the server prepends to a trace — the statement or the payload
  // that broke, and usually the answer
  dumps?: string[];

  // The directory every frame of the trace is under, stated once
  root?: string;
  frames?: string[];
}
