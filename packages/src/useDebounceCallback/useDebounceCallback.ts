import { ref, unref, Ref, computed, watchEffect } from "vue";
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
  func: Ref<T> | T,
  delay: Ref<number> | number = 500,
  options?: Ref<DebounceOptions> | DebounceOptions
): Ref<DebouncedState<T>> {
  const debouncedFunc: Ref<ReturnType<typeof debounce>> | undefined = ref();

  const debounced = computed(() => {
    const debouncedFuncInstance = debounce(
      unref(func),
      unref(delay),
      unref(options)
    );

    const wrappedFunc = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.value;
    };

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc as DebouncedState<T>;
  });

  // Update the debounced function ref whenever func, wait, or options change
  watchEffect(() => {
    debouncedFunc.value = debounce(unref(func), unref(delay), unref(options));
  });

  return debounced;
}
