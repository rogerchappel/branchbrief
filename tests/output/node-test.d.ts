declare module "node:assert" {
  export const strict: {
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    equal(actual: unknown, expected: unknown, message?: string): void;
  };
}

declare module "node:test" {
  export default function test(
    name: string,
    fn: () => void | Promise<void>,
  ): void;
}
