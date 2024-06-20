# useInterval

在具有相同 API 的功能性 Vue 组件中使用。将回调函数设置为第一个参数，并为第二个参数设置延迟（以毫秒为单位）。您也可以停止计时器传递 null 而不是延迟，甚至可以立即执行它，传递 0。

## Usage

```vue
<template>
  <h1>{{ count }}</h1>
  <button @click="isPlaying = !isPlaying">
    {{ isPlaying ? "pause" : "play" }}
  </button>
  <p>
    <label>Delay: </label>
    <input type="number" v-model="delay" />
  </p>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useInterval } from "vhooks-ts";

const count = ref(0);
const delay = ref(1000);
const isPlaying = ref(false);

watchEffect(() => {
  useInterval(
    () => {
      count.value++;
    },
    isPlaying.value ? delay : null
  );
});
</script>
```

## Hook

```js
import { ref, type Ref, watchEffect, unref } from "vue";

let id: number;

export default function useInterval(
  handler: () => void,
  delay: Ref<number | null> | number | null
) {
  const handlerRef = ref(handler);

  watchEffect(() => {
    clearInterval(id);

    delay = unref(delay);

    if (!delay || delay === 0) {
      return;
    }

    id = setInterval(() => handlerRef.value(), delay);

    return () => clearInterval(id);
  });
}
```
