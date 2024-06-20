# useOnClickOutside

用于侦听指定元素外部的点击的 Vue 钩子。

## Usage

```vue
<template>
  <button
    ref="buttonRef"
    @click="handleClickInside"
    :style="{ width: '200px', height: '200px', background: 'cyan' }"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useOnClickOutside } from "vhooks-ts";

const buttonRef = ref();

const handleClickOutside = () => {
  console.log("clicked outside");
};

const handleClickInside = () => {
  console.log("clicked inside");
};

useOnClickOutside(buttonRef, handleClickOutside);
</script>
```

## Hook

```js
import { type Ref } from 'vue'

import { useEventListener } from 'vhooks-ts'

export default function useOnClickOutside<T extends HTMLElement>(
  element: Ref<T>,
  handler: (event: MouseEvent) => void,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
  useEventListener(mouseEvent, (event) => {
    if (!element.value || element.value.contains(event.target as Node)) return

    handler(event)
  })
}
```
