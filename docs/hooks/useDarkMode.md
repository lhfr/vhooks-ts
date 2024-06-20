# useLocalStorage

这个 Vue Hook 为您提供了一个启用、禁用、切换和阅读黑暗主题模式的界面。

相关 hooks:

- [useMediaQuery()](useMediaQuery)
- [useLocalStorage()](useLocalStorage)

## Usage

```vue
<template>
  <p>Current theme: {{ state ? "dark" : "light" }}</p>
  <button @click="toggle">Toggle</button>
  <button @click="enable">Enable</button>
  <button @click="disable">Disable</button>
</template>

<script lang="ts" setup>
import { useDarkMode } from "vhooks-ts";

const { state, toggle, enable, disable } = useDarkMode();
</script>
```

## Hook

```js
import { type Ref, type UnwrapRef, watchEffect } from 'vue'
import { useMediaQuery } from 'vhooks-ts'
import { useLocalStorage } from 'vhooks-ts'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

interface Action<T> {
  state: Ref<UnwrapRef<T | null>>
  toggle: () => void
  enable: () => void
  disable: () => void
}

export default function useDarkMode(
  defaultValue?: boolean,
  localStorageKey: string = 'vhooks-ts-dark-mode'
): Action<boolean> {
  const { state: isDarkOS } = useMediaQuery(COLOR_SCHEME_QUERY)
  const { state, set } = useLocalStorage(localStorageKey, defaultValue ?? isDarkOS.value ?? false)

  watchEffect(() => {
    set(isDarkOS.value)
  })

  return {
    state,
    toggle: () => set((prev) => !prev),
    enable: () => set(true),
    disable: () => set(false)
  }
}
```
