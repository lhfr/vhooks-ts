# useCopyToClipboard

这个 Vue 钩子提供了一个复制方法来保存中的字符串和复制的值（默认值：null）。

## Usage

```vue
<template>
  <h1>Click to copy:</h1>
  <div style="display: flex">
    <button @click="copy('A')">A</button>
    <button @click="copy('B')">B</button>
    <button @click="copy('C')">C</button>
  </div>
  <p>Copied value: {{ state ?? "Nothing is copied yet!" }}</p>
</template>

<script lang="ts" setup>
import { useCopyToClipboard } from "vhooks-ts";

const { state, copy } = useCopyToClipboard();
</script>
```

## Hook

```js
import { ref, type Ref } from 'vue'

interface Action {
  state: Ref<string | null>
  copy: (text: string) => Promise<boolean>
}

export default function useCopyToClipboard(): Action {
  const state = ref<string | null>(null)

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }
    try {
      await navigator.clipboard.writeText(text)
      state.value = text
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      state.value = null
      return false
    }
  }

  return {
    state,
    copy
  }
}
```
