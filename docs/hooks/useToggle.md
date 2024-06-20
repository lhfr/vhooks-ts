# useToggle

一个简单的钩子来切换状态。

## Usage

```vue
<template>
  <p>{{ state }}</p>
  <button @click="toggle()">toggle</button>
</template>

<script lang="ts" setup>
import { useToggle } from "vhooks-ts";

const { state, toggle } = useToggle();
</script>
```

## Hook

```js
import { ref, type Ref } from 'vue'

interface Action<T> {
  state: Ref<T>
  toggle: (value?: T) => void
}

function useToggle<T = boolean>(): Action<T>
function useToggle<T = boolean>(defaultValue: T): Action<T>
function useToggle<T, U>(defaultValue: T, reverseValue: U): Action<T>

function useToggle<D, R>(defaultValue: D = false as D, reverseValue?: R) {
  const state = ref<D | R>(defaultValue)

  const toggle = (value?: D | R) => {
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R
    if (value === undefined) {
      value = state.value === defaultValue ? reverseValueOrigin : defaultValue
    }
    state.value = value as any
  }

  return {
    state,
    toggle
  }
}

export default useToggle
```
