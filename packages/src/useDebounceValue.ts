import { ref, Ref, UnwrapRef, ComputedRef } from "vue";

import type { DebouncedState } from "./useDebounceCallback";
import { useDebounceCallback } from "./useDebounceCallback";

type UseDebounceValueOptions<T> = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (left: T, right: T) => boolean;
};

export function useDebounceValue<T>(
  initialValue: T | (() => T),
  delay: Ref<number>,
  options?: Ref<UseDebounceValueOptions<T>>
): [Ref<UnwrapRef<T>>, ComputedRef<DebouncedState<(value: T) => void>>] {
  const eq =
    options?.value.equalityFn ?? ((left: T, right: T) => left === right);
  const unwrappedInitialValue =
    initialValue instanceof Function ? initialValue() : initialValue;
  const debouncedValue = ref<T>(unwrappedInitialValue);
  const previousValueRef = ref<T | undefined>(unwrappedInitialValue);

  const updateDebouncedValue = useDebounceCallback(
    ref((value) => {
      debouncedValue.value = value;
    }),
    delay,
    options
  );

  // Update the debounced value if the initial value changes
  if (!eq(previousValueRef.value as T, unwrappedInitialValue)) {
    updateDebouncedValue.value(unwrappedInitialValue);
    previousValueRef.value = unwrappedInitialValue as UnwrapRef<T>;
  }

  return [debouncedValue, updateDebouncedValue];
}
