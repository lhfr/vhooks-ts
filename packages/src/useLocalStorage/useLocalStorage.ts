import { ref, unref, Ref, watchEffect, computed } from "vue";

import { useEventListener } from "vhooks-ts";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useLocalStorage<T>(
  key: Ref<string> | string,
  initialValue: Ref<T | (() => T)> | T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [Ref<T>, Dispatch<SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options;

  const serializer = (value: T): string => {
    if (options.serializer) {
      return options.serializer(value);
    }

    return JSON.stringify(value);
  };

  const deserializer = (value: string): T => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    // Support 'undefined' as a value
    if (value === "undefined") {
      return undefined as unknown as T;
    }

    const defaultValue = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return defaultValue.value; // Return initialValue if parsing fails
    }

    return parsed as T;
  };

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    const initialValueToUse = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });

    // Prevent build error "window is undefined" but keep working
    if (IS_SERVER) {
      return initialValueToUse.value;
    }

    try {
      const raw = window.localStorage.getItem(unref(key));
      return raw ? deserializer(raw) : initialValueToUse.value;
    } catch (error) {
      console.warn(`Error reading localStorage key “${unref(key)}”:`, error);
      return initialValueToUse.value;
    }
  };

  const storedValue = ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }

      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    })()
  ) as Ref<T>;

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(readValue()) : value;

      // Save to local storage
      window.localStorage.setItem(unref(key), serializer(newValue));

      // Save state
      storedValue.value = newValue;

      // We dispatch a custom event so every similar useLocalStorage hook is notified
      window.dispatchEvent(
        new StorageEvent("local-storage", { key: unref(key) })
      );
    } catch (error) {
      console.warn(`Error setting localStorage key “${unref(key)}”:`, error);
    }
  };

  const removeValue = () => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key “${unref(
          key
        )}” even though environment is not a client`
      );
    }

    const defaultValue = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });

    // Remove the key from local storage
    window.localStorage.removeItem(unref(key));

    // Save state with default value
    storedValue.value = defaultValue.value;

    // We dispatch a custom event so every similar useLocalStorage hook is notified
    window.dispatchEvent(
      new StorageEvent("local-storage", { key: unref(key) })
    );
  };

  watchEffect(() => {
    storedValue.value = readValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleStorageChange = (event: StorageEvent | CustomEvent) => {
    if (
      (event as StorageEvent).key &&
      (event as StorageEvent).key !== unref(key)
    ) {
      return;
    }
    storedValue.value = readValue();
  };

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue, removeValue];
}
