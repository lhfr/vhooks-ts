import { ref, Ref, onMounted } from "vue";

import { useDebounceCallback } from "./useDebounceCallback";
import { useEventListener } from "./useEventListener";

type WindowSize<T extends number | undefined = number | undefined> = {
  width: T;
  height: T;
};

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === "undefined";

// SSR version of useWindowSize.
export function useWindowSize(
  options: UseWindowSizeOptions<false>
): Ref<WindowSize>;
// CSR version of useWindowSize.
export function useWindowSize(
  options?: Partial<UseWindowSizeOptions<true>>
): Ref<WindowSize<number>>;
export function useWindowSize(
  options: Partial<UseWindowSizeOptions<boolean>> = {}
): Ref<WindowSize | WindowSize<number>> {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const windowSize = ref<WindowSize>(
    (() => {
      if (initializeWithValue) {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      }
      return {
        width: undefined,
        height: undefined,
      };
    })()
  );

  const debouncedSetWindowSize = useDebounceCallback((value: WindowSize) => {
    windowSize.value = value;
  }, options.debounceDelay);

  function handleSize() {
    const setSize = options.debounceDelay
      ? debouncedSetWindowSize.value
      : (value: WindowSize) => {
          windowSize.value = value;
        };

    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  onMounted(() => {
    handleSize();
  });

  return windowSize;
}
