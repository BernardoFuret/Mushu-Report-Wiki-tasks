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

export { sleepAfter };
