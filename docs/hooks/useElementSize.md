# useElementSize

这个钩子可以帮助您动态获得 HTML 元素的宽度和高度。

## Usage

```vue
<template>
  <p>The square width is {{ state.width }}px and height {{ state.height }}px</p>
  <p>Try, resize your window and-or click on the button.</p>

  <button @click="isVisible = !isVisible">
    {{ isVisible ? "Hide" : "Show" }} square
  </button>

  <div
    v-if="isVisible"
    ref="element"
    style="width: 50%; padding-top: 50%; background-color: aquamarine; margin: auto"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useElementSize } from "vhooks-ts";

const isVisible = ref(true);
const { element, state } = useElementSize();
</script>
```

## Hook

```js
import { type Ref, type UnwrapRef, ref, watchEffect } from 'vue'
import { useEventListener } from 'vhooks-ts'

interface State {
  width: number
  height: number
}

export default function useElementSize<T extends HTMLElement>(): {
  element: Ref<UnwrapRef<T | null>>
  state: Ref<State>
} {
  const element = ref<T | null>(null)
  const state = ref({
    width: 0,
    height: 0
  })

  const handleChange = () => {
    state.value = {
      width: element.value?.offsetWidth || 0,
      height: element.value?.offsetHeight || 0
    }
  }

  useEventListener('resize', handleChange)

  watchEffect(() => {
    handleChange()
  })

  return {
    element,
    state
  }
}
```
