import { ref, Ref, computed, ComputedRef, onUnmounted, watchEffect } from "vue";
import debounce from "lodash.debounce";

// TypeScript types
type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

type ControlFunctions = {
  cancel: () => void;
  flush: () => void;
  isPending: Ref<boolean>;
};

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = (
  ...args: Parameters<T>
) => ReturnType<T> | (undefined & ControlFunctions);

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: Ref<T>,
  delay = ref(500),
  options?: Ref<DebounceOptions>
): ComputedRef<DebouncedState<T>> {
  const debouncedFunc: Ref<ReturnType<typeof debounce>> | undefined = ref();

  onUnmounted(() => {
    if (debouncedFunc.value) {
      debouncedFunc.value.cancel();
    }
  });

  const debounced = computed(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    const isPending = computed(() => !!debouncedFunc.value);

    Object.defineProperty(wrappedFunc, "isPending", {
      get: () => isPending.value,
      enumerable: true,
    });

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc as DebouncedState<T>;
  });

  // Update the debounced function ref whenever func, delay, or options change
  watchEffect(() => {
    debouncedFunc.value = debounce(func, delay, options);
  });

  return debounced;
}
