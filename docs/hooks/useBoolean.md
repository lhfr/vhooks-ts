# useBoolean

一个简单的钩子来处理布尔值。

相关 hooks:

- [useToggle()](useToggle)

## Usage

```vue
<template>
  <p>{{ state }}</p>
  <button @click="setTrue">setTrue</button>
  <button @click="setFalse">setFalse</button>
  <button @click="toggle()">toggle</button>
</template>

<script lang="ts" setup>
import { useBoolean } from "vhooks-ts";

const { state, setTrue, setFalse, toggle } = useBoolean();
</script>
```

## Hook

```js
import { useToggle } from "vhooks-ts";

export default function useBoolean(defaultValue?: Boolean) {
  const { state, toggle } = useToggle(defaultValue);

  const setTrue = () => toggle(true);
  const setFalse = () => toggle(false);

  return {
    state,
    setTrue,
    setFalse,
    toggle,
  };
}
```
