# useHover

Vue UI 传感器挂钩，使用 Typescript 而不是 CSS 来确定鼠标元素是否在悬停元素中。通过这种方式，您可以将逻辑与 UI 分离。

## Usage

```vue
<template>
  <div ref="hoverRef">
    The current div is {{ state ? "hovered" : "unhovered" }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useHover } from "vhooks-ts";

const hoverRef = ref(null);
const { state } = useHover(null);
</script>
```

## Hook

```js
import { type Ref, ref } from 'vue'
import { useEventListener } from 'vhooks-ts'

export default function useHover<T extends HTMLElement>(element: Ref<T>): { state: Ref<boolean> } {
  const state = ref(false)

  useEventListener('mouseenter', () => (state.value = true), element)
  useEventListener('mouseleave', () => (state.value = false), element)

  return {
    state
  }
}
```
