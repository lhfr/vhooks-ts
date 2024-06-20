# useCountdown

一个简单的倒计时实现，支持增量和减量。

相关 hooks:

- [useBoolean()](useBoolean)
- [useToggle()](useToggle)
- [useCounter()](useCounter)
- [useInterval()](useInterval)

## Usage

```vue
<template>
  <p>Count: {{ state }}</p>
  <input type="number" v-model="delay" />
  <button @click="start">start</button>
  <button @click="stop">stop</button>
  <button @click="reset">reset</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCountdown } from "vhooks-ts";

const delay = ref(1000);

const { state, start, stop, reset } = useCountdown({
  defaultValue: 60,
  delay,
});
</script>
```

## Hook

```js
import { type Ref, unref, watchEffect } from 'vue'
import { useCounter } from 'vhooks-ts'
import { useBoolean } from 'vhooks-ts'
import { useInterval } from 'vhooks-ts'

interface Action {
  state: Ref<number>
  start: () => void
  stop: () => void
  reset: () => void
}

interface Option {
  defaultValue: number
  delay?: Ref<number> | number
  isIncrement?: Ref<boolean> | boolean
  stopNumber?: Ref<number> | number
}

export default function useCountdown(option: Option): Action {
  const { state, increment, decrement, reset } = useCounter(option.defaultValue)
  const { state: isStart, setTrue: start, setFalse: stop } = useBoolean(false)

  const callback = () => {
    if (state.value === unref(option.stopNumber)) {
      stop()
      return
    }
    unref(option.isIncrement) ? increment() : decrement()
  }

  watchEffect(() => {
    useInterval(callback, isStart.value ? unref(option.delay) ?? 1000 : null)
  })

  return {
    state,
    start,
    stop,
    reset
  }
}
```
