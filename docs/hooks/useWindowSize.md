# useUpdateEffect

使用这个 Vue Hook 可以轻松检索窗口尺寸，它也适用于 Resize。

## Usage

```vue
<template>
  <div>
    The current window dimensions are: <code>{{ JSON.stringify(state) }}</code>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "vhooks-ts";

const { state } = useWindowSize();
</script>
```

## Hook

```js
import { type Ref, ref, onMounted } from 'vue'
import { useEventListener } from 'vhooks-ts'

interface Action {
  width: number
  height: number
}

export default function useWindowSize(): {
  state: Ref<Action>
} {
  const state = ref()

  const get = () => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
    return undefined
  }

  onMounted(() => {
    state.value = get()
  })

  useEventListener('resize', () => {
    state.value = get()
  })

  return {
    state
  }
}
```
