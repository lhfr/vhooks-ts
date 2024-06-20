# useIsFirstRender

返回布尔值的简单 React 钩子：初始化为 true，然后总是 false。

另请参阅:

- [useIsMounted()](useIsMounted)
- [useUpdateEffect()](useUpdateEffect)

## Usage

```vue
<template>
  <p>{{ data }}</p>
  <button @click="data = Date.now()">Update data</button>
  <p>Is first render: {{ state ? "yes" : "no" }}</p>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useIsFirstRender } from "vhooks-ts";

const { state } = useIsFirstRender();
const data = ref(0);
</script>
```

## Hook

```js
import { ref, type Ref, onUpdated } from "vue";

export default function useIsFirstRender(): {
  state: Ref<boolean>,
} {
  const state = ref(true);

  onUpdated(() => {
    state.value = false;
  });

  return {
    state,
  };
}
```
