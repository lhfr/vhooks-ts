import { ref, Ref, onMounted } from "vue";

import { useDebounceCallback, useEventListener } from "vhooks-ts";

type UseScreenOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: Ref<number> | number;
};

const IS_SERVER = typeof window === "undefined";

// SSR version of useScreen.
export function useScreen(
  options: UseScreenOptions<false>
): Ref<Screen | undefined>;
// CSR version of useScreen.
export function useScreen(
  options?: Partial<UseScreenOptions<true>>
): Ref<Screen>;
export function useScreen(
  options: Partial<UseScreenOptions<boolean>> = {}
): Ref<Screen | undefined> {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const readScreen = () => {
    if (IS_SERVER) {
      return undefined;
    }
    return window.screen;
  };

  const screen = ref<Screen | undefined>(
    initializeWithValue ? readScreen() : undefined
  );

  const debouncedSetScreen = useDebounceCallback(
    (value: Screen) => (screen.value = value),
    options.debounceDelay
  );

  // Handles the resize event of the window.
  function handleSize() {
    const newScreen = readScreen();
    const setSize = options.debounceDelay
      ? debouncedSetScreen.value
      : (value: Screen) => (screen.value = value);

    if (newScreen) {
      // Create a shallow clone to trigger a re-render (#280).
      const {
        width,
        height,
        availHeight,
        availWidth,
        colorDepth,
        orientation,
        pixelDepth,
      } = newScreen;

      setSize({
        width,
        height,
        availHeight,
        availWidth,
        colorDepth,
        orientation,
        pixelDepth,
      });
    }
  }

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  onMounted(() => {
    handleSize();
  });

  return screen;
}
