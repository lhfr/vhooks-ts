import { ref, Ref } from "vue";

import type { DebouncedState } from "./useDebounceCallback";
import { useDebounceCallback } from "./useDebounceCallback";

type UseDebounceValueOptions<T> = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

export function useDebounceValue<T>(
  initialValue: T | (() => T),
  delay: number,
  options?: UseDebounceValueOptions<T>
): [Ref<T>, Ref<DebouncedState<(value: T) => void>>] {
  const unwrappedInitialValue =
    initialValue instanceof Function ? initialValue() : initialValue;
  const debouncedValue = ref<T>(unwrappedInitialValue) as Ref<T>;

  const updateDebouncedValue = useDebounceCallback(
    (value) => {
      debouncedValue.value = value;
    },
    delay,
    options
  );

  return [debouncedValue, updateDebouncedValue];
}
