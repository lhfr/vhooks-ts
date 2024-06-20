# useUpdateEffect

只是跳过第一次渲染的 watchEffect 的修改版本。

另请参阅:

- [useIsFirstRender()](useIsFirstRender)
- [useIsMounted()](useIsMounted)

## Usage

```vue
<template>
  <p>{{ data }}</p>
  <button @click="data = Date.now()">Update data</button>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useUpdateEffect } from "vhooks-ts";

const data = ref(0);

watchEffect(() => {
  console.log("Normal useEffect", data.value);
});

useUpdateEffect(() => {
  console.log("Update useEffect only", data.value);
});
</script>
```

## Hook

```js
import { watchEffect } from "vue";
import { useIsFirstRender } from "vhooks-ts";

export default function useUpdateEffect(handler: Function) {
  const { state } = useIsFirstRender();

  watchEffect(() => {
    if (!state.value) {
      handler();
    }
  });
}
```
