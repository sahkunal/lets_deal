import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.Buffer = window.Buffer || Buffer;
  // @ts-ignore
  window.global = window.global || window;
  // @ts-ignore
  window.process = window.process || { env: {} };
}

export { Buffer };
