# useMediaQuery

使用这个 Vue Hook 可以轻松检索媒体尺寸，它也适用于 Resize。

## Usage

```vue
<template>
  The view port is {{ state ? "at least" : "less than" }} 768 pixels wide
</template>

<script lang="ts" setup>
import { useMediaQuery } from "vhooks-ts";

const { state } = useMediaQuery("(min-width: 768px)");
</script>
```

## Hook

```js
import { ref, type Ref, watchEffect } from "vue";

const getMatches = (value: string) => {
  return window.matchMedia(value).matches;
};

export default function useMediaQuery(defaultValue: string): {
  state: Ref<boolean>,
} {
  const state = ref(getMatches(defaultValue));

  const handleChange = () => {
    state.value = getMatches(defaultValue);
  };

  watchEffect(() => {
    const matchMedia = window.matchMedia(defaultValue);

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  });

  return {
    state,
  };
}
```
