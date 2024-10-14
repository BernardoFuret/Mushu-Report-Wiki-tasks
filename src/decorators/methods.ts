import { sleep } from '@/helpers';

const sleepAfter = (ms: number) => {
  return function directive<TThis, TArgs extends unknown[], TReturn>(
    target: (this: TThis, ...args: TArgs) => Promise<TReturn>,
  ): typeof target {
    return async function decorator(this: TThis, ...args: TArgs): Promise<TReturn> {
      const result = await target.call(this, ...args);

      await sleep(ms);

      return result;
    };
  };
};

/* const after = <TThis, TArgs extends unknown[]>(
  callback: (this: TThis, self: TThis, ...args: TArgs) => void,
) => {
  return function directive<TReturn>(
    target: (this: TThis, ...args: TArgs) => Promise<TReturn>,
    // context: ClassMethodDecoratorContext<TThis, (this: TThis, ...args: TArgs) => Promise<TReturn>>,
  ): typeof target {
    return async function decorator(this: TThis, ...args: TArgs): Promise<TReturn> {
      const result = await target.call(this, ...args);

      await Promise.resolve(callback.call(this, this, ...args));

      return result;
    };
  };
}; */

export { sleepAfter };
