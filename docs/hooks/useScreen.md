# useScreen

使用这个 Vue Hook 可以轻松检索 window.screen 对象，它也适用于 Resize。

## Usage

```vue
<template>
  The current window dimensions are:{' '}
  <code>
    {{ JSON.stringify({ width: state?.width, height: state?.height }) }}
  </code>
</template>

<script lang="ts" setup>
import { useScreen } from "vhooks-ts";

const { state } = useScreen();
</script>
```

## Hook

```js
import { type Ref, ref, onMounted } from "vue";
import { useEventListener } from "vhooks-ts";

export default function useScreen(): {
  state: Ref<Screen>,
} {
  const state = ref();

  const get = () => {
    if (typeof window !== "undefined") {
      return window.screen;
    }
    return undefined;
  };

  onMounted(() => {
    state.value = get();
  });

  useEventListener("resize", () => {
    state.value = get();
  });

  return {
    state,
  };
}
```
