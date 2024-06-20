# useScreen

一个简单的钩子来实现步骤。

## Usage

```vue
<template>
  <p>Current step is {{ state }}</p>
  <p>Can go to previous step {{ canPrev ? "yes" : "no" }}</p>
  <p>Can go to next step {{ canNext ? "yes" : "no" }}</p>
  <button @click="toNext">Go to next step</button>
  <button @click="toPrev">Go to previous step</button>
  <button @click="reset">Reset</button>
  <button @click="set(3)">Set to step 3</button>
</template>

<script lang="ts" setup>
import { useStep } from "vhooks-ts";

const { state, canNext, canPrev, toNext, toPrev, set, reset } = useStep(5);
</script>
```

## Hook

```js
import { type Ref, ref, computed } from 'vue'

export default function UseStep(defaultValue: number): {
  state: Ref<number>
  canNext: Ref<boolean>
  canPrev: Ref<boolean>
  toNext: () => void
  toPrev: () => void
  set: (value: number | ((value: number) => number)) => void
  reset: () => void
} {
  const state = ref(1)

  const canNext = computed(() => state.value < defaultValue)

  const canPrev = computed(() => state.value > 1)

  const toNext = () => {
    if (canNext.value) state.value++
  }

  const toPrev = () => {
    if (canPrev.value) state.value--
  }

  const set = (value: number | ((value: number) => number)) => {
    const newValue = value instanceof Function ? value(state.value) : value
    if (newValue >= 1 && newValue <= defaultValue) {
      state.value = newValue
      return
    }
    throw new Error('Step not valid')
  }

  const reset = () => {
    state.value = 1
  }

  return {
    state,
    canNext,
    canPrev,
    toNext,
    toPrev,
    set,
    reset
  }
}
```
