import type {Frame} from 'sentry/types/event';

// TODO(ts): define correct stack trace type
function getRelevantFrame(stacktrace: any): Frame {
  if (!stacktrace.hasSystemFrames) {
    return stacktrace.frames[stacktrace.frames.length - 1];
  }
  for (let i = stacktrace.frames.length - 1; i >= 0; i--) {
    const frame = stacktrace.frames[i];
    if (frame.inApp) {
      return frame;
    }
  }
  // this should not happen
  return stacktrace.frames[stacktrace.frames.length - 1];
}

export default getRelevantFrame;
