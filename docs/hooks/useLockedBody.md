# useLockedBody

这个 Vue 钩子用于阻止和还原页面的滚动。

## Usage

```vue
<template>
  <div :style="fakeScrollableStyle">
    <button :style="fixedCenterStyle" @click="toggle">
      {{ state ? "unlock scroll" : "lock scroll" }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties } from "vue";
import { useLockedBody } from "vhooks-ts";

const fakeScrollableStyle: CSSProperties = {
  minHeight: "150vh",
  background: "linear-gradient(palegreen, palegoldenrod, palevioletred)",
};
const fixedCenterStyle: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const { state, set } = useLockedBody(false);
const toggle = () => {
  set(!state.value);
};
</script>
```

## Hook

```js
import { type Ref, ref, watchEffect, onMounted } from 'vue'

interface Action {
  state: Ref<boolean>
  set: (value: boolean | ((value: boolean) => boolean)) => void
}

export default function useLockedBody<T extends HTMLElement>(
  defaultValue = false,
  element?: Ref<T>
): Action {
  const state = ref(defaultValue)
  const originalPaddingRight = ref('')
  const originalOverflow = ref('')

  onMounted(() => {
    const root = element?.value || document.body

    originalOverflow.value = window.getComputedStyle(root).overflow
    originalPaddingRight.value = window.getComputedStyle(root).paddingRight
  })

  watchEffect(() => {
    const root = element?.value || document.body

    if (!state.value) {
      root.style.paddingRight = originalPaddingRight.value
      root.style.overflow = originalOverflow.value
    } else {
      if (element?.value) {
        root.style.paddingRight = `${root.offsetWidth - root.scrollWidth}px`
      } else {
        root.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
      }
      root.style.overflow = 'hidden'
    }

    return () => {
      root.style.paddingRight = originalPaddingRight.value
      root.style.overflow = originalOverflow.value
    }
  })

  const set = (value: boolean | ((value: boolean) => boolean)) => {
    state.value = value instanceof Function ? value(state.value) : value
  }

  return {
    state,
    set
  }
}
```
