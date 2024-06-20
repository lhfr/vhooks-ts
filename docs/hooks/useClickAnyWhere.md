# useClickAnyWhere

这个简单的 Vue 钩子在页面级别为您提供了一个点击事件监听器。

相关 hooks:

- [useEventListener()](useEventListener)

## Usage

```vue
<template>
  <p>Click count: {{ count }}</p>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useClickAnyWhere } from "vhooks-ts";

const count = ref(0);

useClickAnyWhere(() => {
  count.value++;
});
</script>
```

## Hook

```js
import { useEventListener } from "vhooks-ts";

type Handler = (event: MouseEvent) => void;

export default function useClickAnyWhere(handler: Handler) {
  useEventListener("click", handler);
}
```
