import { ref, unref, Ref, computed, watchEffect } from "vue";

import { useEventListener } from "vhooks-ts";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WindowEventMap {
    "session-storage": CustomEvent;
  }
}

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

type UseSessionStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useSessionStorage<T>(
  key: Ref<string> | string,
  initialValue: Ref<T | (() => T)> | T | (() => T),
  options: UseSessionStorageOptions<T> = {}
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

  // Get from session storage then
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
      const raw = window.sessionStorage.getItem(unref(key));
      return raw ? deserializer(raw) : initialValueToUse.value;
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${unref(key)}”:`, error);
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
  // ... persists the new value to sessionStorage.
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried setting sessionStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(readValue()) : value;

      // Save to session storage
      window.sessionStorage.setItem(unref(key), serializer(newValue));

      // Save state
      storedValue.value = newValue;

      // We dispatch a custom event so every similar useSessionStorage hook is notified
      window.dispatchEvent(
        new StorageEvent("session-storage", { key: unref(key) })
      );
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error);
    }
  };

  const removeValue = () => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried removing sessionStorage key “${key}” even though environment is not a client`
      );
    }

    const defaultValue = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });

    // Remove the key from session storage
    window.sessionStorage.removeItem(unref(key));

    // Save state with default value
    storedValue.value = defaultValue.value;

    // We dispatch a custom event so every similar useSessionStorage hook is notified
    window.dispatchEvent(
      new StorageEvent("session-storage", { key: unref(key) })
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

  // this is a custom event, triggered in writeValueToSessionStorage
  // See: useSessionStorage()
  useEventListener("session-storage", handleStorageChange);

  return [storedValue, setValue, removeValue];
}
