import { ref, unref, Ref, watchEffect } from "vue";

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: Ref<string> | string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): Ref<boolean> {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const matches = ref<boolean>(
    initializeWithValue ? getMatches(unref(query)) : defaultValue
  );

  // Handles the change event of the media query.
  function handleChange() {
    matches.value = getMatches(unref(query));
  }

  watchEffect(() => {
    const matchMedia = window.matchMedia(unref(query));

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  });

  return matches;
}
