import { Ref, watch } from "vue";

import { useLocalStorage, useMediaQuery } from "vhooks-ts";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "vhooks-ts-dark-mode";

type DarkModeOptions = {
  defaultValue?: boolean;
  localStorageKey?: Ref<string> | string;
  initializeWithValue?: boolean;
};

type DarkModeReturn = {
  isDarkMode: Ref<boolean>;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  set: (value: boolean) => void;
};

export function useDarkMode(options: DarkModeOptions = {}): DarkModeReturn {
  const {
    defaultValue,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true,
  } = options;

  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue,
    defaultValue,
  });

  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    localStorageKey,
    defaultValue ?? isDarkOS.value ?? false,
    { initializeWithValue }
  );

  // Update darkMode if os prefers changes
  watch(isDarkOS, () => {
    if (isDarkOS.value !== isDarkMode.value) {
      setDarkMode(isDarkOS.value);
    }
  });

  return {
    isDarkMode,
    toggle: () => {
      setDarkMode((prev) => !prev);
    },
    enable: () => {
      setDarkMode(true);
    },
    disable: () => {
      setDarkMode(false);
    },
    set: (value) => {
      setDarkMode(value);
    },
  };
}
