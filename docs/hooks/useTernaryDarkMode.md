# useTernaryDarkMode

这个 Vue Hook 为您提供了一个在三个值之间切换和读取黑暗主题模式的界面。它在内部使用 useLocalStorage（）来保持该值，并侦听操作系统的配色方案首选项。

## Usage

```vue
<template>
  <div>
    <p>Current theme: {{ isDark ? "dark" : "light" }}</p>
    <p>ternaryMode: {{ state }}</p>
    <p>
      Toggle between three modes
      <button @click="toggle">Toggle from {{ state }}</button>
    </p>
    <p>
      Select a mode
      <br />
      <select v-model="state" @change="handleChange">
        <option value="light">light</option>
        <option value="system">system</option>
        <option value="dark">dark</option>
      </select>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useTernaryDarkMode } from "vhooks-ts";

const { isDark, state, set, toggle } = useTernaryDarkMode();

const handleChange = (event) => {
  set(event.target.value);
};
</script>
```

## Hook

```js
import { computed } from "vue";
import { useMediaQuery } from "vhooks-ts";
import { useLocalStorage } from "vhooks-ts";

type Mode = "system" | "dark" | "light";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export default function useTernaryDarkMode(
  defaultValue?: Mode,
  localStorageKey?: string
) {
  const { state: isDarkOS } = useMediaQuery(COLOR_SCHEME_QUERY);
  const { state, set } = useLocalStorage(
    localStorageKey || "vhooks-ts-dark-mode",
    defaultValue
  );

  const isDark = computed(
    () => state.value === "dark" || (state.value === "system" && isDarkOS)
  );

  const toggle = () => {
    const modes: Mode[] = ["light", "system", "dark"];
    set((prevMode) => {
      return prevMode && modes[(modes.indexOf(prevMode) + 1) % modes.length];
    });
  };

  return {
    isDark,
    state,
    set,
    toggle,
  };
}
```
