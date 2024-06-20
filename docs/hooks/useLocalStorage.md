# useLocalStorage

使用本地存储保持状态，以便在页面刷新后保持该状态。

相关 hooks:

- [useEventListener()](useEventListener)

## Usage

```vue
<template>
  <button @click="toggleTheme">
    The current theme is {{ state ? "dark" : "light" }}
  </button>
</template>

<script lang="ts" setup>
import { useLocalStorage } from "vhooks-ts";

const { state, set } = useLocalStorage("darkTheme", true);

const toggleTheme = () => {
  set((prevValue: boolean) => !prevValue);
};
</script>
```

## Hook

```js
import { type Ref, type UnwrapRef, ref, onMounted } from 'vue'
import { useEventListener } from 'vhooks-ts'

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): {
  state: Ref<UnwrapRef<T | null>>
  set: (value: UnwrapRef<T | null> | ((value: UnwrapRef<T | null>) => UnwrapRef<T | null>)) => void
} {
  const state = ref<T | null>(null)

  onMounted(() => {
    state.value = get()
  })

  const get = () => {
    if (typeof window === 'undefined') {
      return defaultValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
      return defaultValue
    }
  }

  const set = (
    value: UnwrapRef<T | null> | ((value: UnwrapRef<T | null>) => UnwrapRef<T | null>)
  ) => {
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      )
    }
    try {
      const newValue = value instanceof Function ? value(state.value) : value
      window.localStorage.setItem(key, JSON.stringify(newValue))
      state.value = newValue
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }

  const handleChange = (event: StorageEvent) => {
    if (event?.key && event.key !== key) {
      return
    }
    state.value = get()
  }

  useEventListener('storage', handleChange)

  return {
    state,
    set
  }
}
```
