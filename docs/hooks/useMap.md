# useMap

这个 Vue 钩子提供了一个 API 来与 Map 交互。

## Usage

```vue
<template>
  <div>
    <button @click="handleSet">Add</button>
    <button @click="handleReset">Reset</button>
    <button @click="handleSetAll">Set new data</button>
    <button @click="handleRemove" :disabled="!state.get('hello')">
      Remove "hello"
    </button>

    <pre>
      Map 
      (
        <template v-for="[key, value] in Array.from(state.entries())" :key="key">
          <br />
          {{ `${key}: ${value}` }}
        </template>
        <br />
      )
    </pre>
  </div>
</template>

<script lang="ts" setup>
import { useMap } from "vhooks-ts";

const { state, set, setAll, reset, remove } = useMap([["key", "🆕"]]);

const handleSet = () => set(String(Date.now()), "📦");
const handleSetAll = () =>
  setAll([
    ["hello", "👋"],
    ["data", "📦"],
  ]);
const handleReset = () => reset();
const handleRemove = () => remove("hello");
</script>
```

## Hook

```js
import { type Ref, ref } from 'vue'

type State<T, K> = Map<T, K> | [T, K][]

interface Action<T, K> {
  state: Ref<Map<T, K>>
  set: (key: T, value: K) => void
  setAll: (entries: State<T, K>) => void
  remove: (key: T) => void
  reset: () => void
}

export default function useMap<T, K>(defaultValue: State<T, K>): Action<T, K> {
  const state = ref(new Map(defaultValue))

  const set = (key: T, value: K) => {
    state.value.set(key, value)
  }

  const setAll = (entries: State<T, K>) => {
    state.value.clear()
    if (entries instanceof Map) {
      entries.forEach((value, key) => state.value.set(key, value))
    } else {
      entries.forEach(([key, value]) => state.value.set(key, value))
    }
  }

  const remove = (key: T) => {
    state.value.delete(key)
  }

  const reset = () => {
    state.value.clear()
  }

  return {
    state,
    set,
    setAll,
    remove,
    reset
  }
}
```
