import { ref, Ref } from "vue";

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

type UseCounterReturn = {
  count: Ref<number>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
};

export function useCounter(initialValue?: number): UseCounterReturn {
  const count = ref(initialValue ?? 0);
  const setCount: Dispatch<SetStateAction<number>> = (x) => {
    count.value = x instanceof Function ? x(count.value) : x;
  };

  const increment = () => {
    setCount((x) => x + 1);
  };

  const decrement = () => {
    setCount((x) => x - 1);
  };

  const reset = () => {
    setCount(initialValue ?? 0);
  };

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
