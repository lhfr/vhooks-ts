import { reactive, unref, Ref, toRefs, onMounted } from "vue";

import { useDebounceCallback, useEventListener } from "vhooks-ts";

type WindowSize<T extends number | undefined = number | undefined> = {
  width: T;
  height: T;
};

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: Ref<number> | number;
};

type SizeReturn<T extends number | undefined = number | undefined> = {
  width: Ref<T>;
  height: Ref<T>;
};

const IS_SERVER = typeof window === "undefined";

// SSR version of useWindowSize.
export function useWindowSize(options: UseWindowSizeOptions<false>): SizeReturn;
// CSR version of useWindowSize.
export function useWindowSize(
  options?: Partial<UseWindowSizeOptions<true>>
): SizeReturn<number>;
export function useWindowSize(
  options: Partial<UseWindowSizeOptions<boolean>> = {}
): SizeReturn | SizeReturn<number> {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const windowSize = reactive<WindowSize>(
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
    windowSize.width = value.width;
    windowSize.height = value.height;
  }, options.debounceDelay);

  function handleSize() {
    const setSize = options.debounceDelay
      ? debouncedSetWindowSize.value
      : (value: WindowSize) => {
          windowSize.width = value.width;
          windowSize.height = value.height;
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

  return {
    ...toRefs(windowSize),
  };
}
