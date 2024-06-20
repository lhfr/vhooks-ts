# useIsMounted

这个 Vue 钩子通过一个返回布尔值来判断组件是否在加载状态。

另请参阅:

- [useIsFirstRender()](useIsFirstRender)
- [useUpdateEffect()](useUpdateEffect)

## Usage

```vue
<template>
  <div v-if="state">Mounted</div>
</template>

<script lang="ts" setup>
import { useIsMounted } from "vhooks-ts";

const { state } = useIsMounted();
</script>
```

## Hook

```js
import { ref, onMounted, onUnmounted } from "vue";

export default function useIsMounted() {
  const state = ref(false);

  onMounted(() => {
    state.value = true;
  });

  onUnmounted(() => {
    state.value = false;
  });

  return {
    state,
  };
}
```
