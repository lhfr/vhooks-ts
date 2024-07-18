import { ref, unref, Ref, watchEffect, computed } from "vue";

import type { DebouncedState } from "../useDebounceCallback";
import { useDebounceCallback } from "vhooks-ts";

type UseDebounceValueOptions<T> = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (left: T, right: T) => boolean;
};

export function useDebounceValue<T>(
  initialValue: Ref<T | (() => T)> | T | (() => T),
  delay: Ref<number> | number,
  options?: Ref<UseDebounceValueOptions<T>> | UseDebounceValueOptions<T>
): [Ref<T>, Ref<DebouncedState<(value: T) => void>>] {
  const eq = computed(
    () => unref(options)?.equalityFn ?? ((left: T, right: T) => left === right)
  );
  const unwrappedInitialValue = computed(() => {
    const value = unref(initialValue);
    return value instanceof Function ? value() : value;
  });
  const debouncedValue = ref<T>(unwrappedInitialValue.value) as Ref<T>;
  const previousValueRef = ref<T | undefined>(
    unwrappedInitialValue.value
  ) as Ref<T>;

  const updateDebouncedValue = useDebounceCallback(
    (value) => {
      debouncedValue.value = value;
    },
    unref(delay),
    unref(options)
  );

  // Update the debounced value if the initial value changes
  watchEffect(() => {
    if (!eq.value(previousValueRef.value as T, unwrappedInitialValue.value)) {
      updateDebouncedValue.value(unwrappedInitialValue);
      previousValueRef.value = unwrappedInitialValue.value;
    }
  });

  return [debouncedValue, updateDebouncedValue];
}
