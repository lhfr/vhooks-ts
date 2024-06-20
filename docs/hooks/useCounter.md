# useCounter

一个简单的钩子来实现计数器。

## Usage

```vue
<template>
  <p>Count is {{ state }}</p>
  <button @click="increment()">Increment</button>
  <button @click="decrement()">Decrement</button>
  <button @click="reset()">Reset</button>
  <button @click="multiplyBy2()">Multiply by 2</button>
</template>

<script lang="ts" setup>
import { useCounter } from from "vhooks-ts";

const { state, increment, decrement, reset, set } = useCounter()

const multiplyBy2 = () => set((value) => value * 2)
</script>
```

## Hook

```js
import { ref, type Ref } from 'vue'

interface Action {
  state: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
  set: (value: number | ((value: number) => number)) => void
}

export default function useCounter(defaultValue?: number): Action {
  const state = ref(defaultValue || 0)

  const increment = () => {
    state.value++
  }

  const decrement = () => {
    state.value--
  }

  const reset = () => {
    state.value = defaultValue || 0
  }

  const set = (value: number | ((value: number) => number)) => {
    state.value = value instanceof Function ? value(state.value) : value
  }

  return {
    state,
    increment,
    decrement,
    reset,
    set
  }
}
```
