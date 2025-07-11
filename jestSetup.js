import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import { TextEncoder, TextDecoder } from "node:util";
import { ReadableStream } from "node:stream/web";

Object.assign(global, { TextDecoder, TextEncoder, ReadableStream });

const passMessage = (actual, expected) => () =>
  `${matcherHint(".not.toMatchPath")}

Expected value not to match:
  ${printExpected(expected)}
Received:
  ${printReceived(actual)}`;

const failMessage = (actual, expected) => () =>
  `${matcherHint(".toMatchPath")}

Expected value to match:
  ${printExpected(expected)}
Received:
  ${printReceived(actual)}`;

expect.extend({
  toMatchPath: (actual, expected) => {
    const normalised = actual.split(":").pop().replaceAll("\\", "/");
    return expected === normalised
      ? { pass: true, message: passMessage(actual, normalised) }
      : { pass: false, message: failMessage(actual, normalised) };
  },
});
