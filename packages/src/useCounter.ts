import { ref, Ref } from "vue";

type UseCounterReturn = {
  count: Ref<number>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (x: number | ((x: number) => number)) => void;
};

export function useCounter(initialValue?: number): UseCounterReturn {
  const count = ref(initialValue ?? 0);
  const setCount = (x: number | ((x: number) => number)) => {
    count.value = typeof x === "number" ? x : x(count.value);
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
