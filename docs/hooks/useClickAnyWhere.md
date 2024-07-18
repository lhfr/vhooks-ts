# useClickAnyWhere

Custom hook that handles click events anywhere on the document.

## Usage

```vue
<template>
  <div>
    <p>Click count: {{ count }}</p>
  </div>
</template>

<script setup lang="ts">
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

export function useClickAnyWhere(handler: (event: MouseEvent) => void) {
  useEventListener("click", (event) => {
    handler(event);
  });
}
```
