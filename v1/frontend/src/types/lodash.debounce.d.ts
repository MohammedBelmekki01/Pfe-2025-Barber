declare module "lodash.debounce" {
  export default function debounce<TArgs extends unknown[], TReturn>(
    func: (...args: TArgs) => TReturn,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean; maxWait?: number }
  ): ((...args: TArgs) => TReturn) & { cancel: () => void; flush: () => void };
}