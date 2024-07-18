# useBoolean

Custom hook that handles boolean state with useful utility functions.

## Usage

```vue
<template>
  <div>
    <p>
      Value is <code>{{ value.toString() }}</code>
    </p>
    <button @click="setTrue">set true</button>
    <button @click="setFalse">set false</button>
    <button @click="toggle">toggle</button>
    <button @click="customToggle">custom toggle</button>
  </div>
</template>

<script setup lang="ts">
import { useBoolean } from "vhooks-ts";

const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);

// Just an example to use "setValue"
const customToggle = () => {
  setValue((x: boolean) => !x);
};
</script>
```

## Hook

```js
import { ref, Ref } from "vue";

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

type UseBooleanReturn = {
  value: Ref<boolean>,
  setValue: Dispatch<SetStateAction<boolean>>,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const value = ref(defaultValue);
  const setValue: Dispatch<SetStateAction<boolean>> = (x) => {
    value.value = x instanceof Function ? x(value.value) : x;
  };

  const setTrue = () => setValue(true);

  const setFalse = () => setValue(false);

  const toggle = () => setValue((x) => !x);

  return { value, setValue, setTrue, setFalse, toggle };
}
```
