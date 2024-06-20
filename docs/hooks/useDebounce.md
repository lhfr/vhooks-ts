# useDebounce

此 Vue 钩子有助于限制组件被多次重新渲染。

## Usage

```vue
<template>
  <p>Value real-time: {{ value }}</p>
  <p>Debounced value: {{ state }}</p>
  <input type="text" v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useDebounce } from "vhooks-ts";

const value = ref("");
const { state } = useDebounce(value, 1000);
</script>
```

## Hook

```js
import { ref, type Ref, watchEffect } from 'vue'

let id: number

interface Action<T> {
  state: Ref<T>
}

function useDebounce<T>(defaultValue: Ref<T>): Action<T>
function useDebounce<T>(defaultValue: Ref<T>, delay: number): Action<T>

function useDebounce<T>(defaultValue: Ref<T>, delay?: number) {
  const state = ref()

  watchEffect(() => {
    clearTimeout(id)

    id = setTimeout(() => {
      state.value = defaultValue.value
    }, delay || 500)

    return () => clearTimeout(id)
  })

  return {
    state
  }
}

export default useDebounce
```
