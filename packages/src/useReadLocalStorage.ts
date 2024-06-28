import { ref, unref, Ref, watchEffect } from "vue";

import { useEventListener } from "./useEventListener";

const IS_SERVER = typeof window === "undefined";

type Options<T, InitializeWithValue extends boolean | undefined> = {
  deserializer?: (value: string) => T;
  initializeWithValue: InitializeWithValue;
};

// SSR version
export function useReadLocalStorage<T>(
  key: Ref<string> | string,
  options: Options<T, false>
): Ref<T | null | undefined>;
// CSR version
export function useReadLocalStorage<T>(
  key: Ref<string> | string,
  options?: Partial<Options<T, true>>
): Ref<T | null>;
export function useReadLocalStorage<T>(
  key: Ref<string> | string,
  options: Partial<Options<T, boolean>> = {}
): Ref<T | null | undefined> {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const deserializer = (value: string): T | null => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    // Support 'undefined' as a value
    if (value === "undefined") {
      return undefined as unknown as T;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }

    return parsed as T;
  };

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T | null => {
    // Prevent build error "window is undefined" but keep keep working
    if (IS_SERVER) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(unref(key));
      return raw ? deserializer(raw) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key “${unref(key)}”:`, error);
      return null;
    }
  };

  const storedValue = ref(
    initializeWithValue ? readValue() : undefined
  ) as Ref<T>;

  // Listen if localStorage changes
  watchEffect(() => {
    storedValue.value = readValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleStorageChange = (event: StorageEvent | CustomEvent) => {
    if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
      return;
    }
    storedValue.value = readValue();
  };

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener("local-storage", handleStorageChange);

  return storedValue;
}
