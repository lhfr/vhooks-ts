# useScreen

使用这个 Vue 钩子在一行中动态加载外部脚本。

## Usage

```vue
<template>
  <p>Current status: {{ state }}</p>
  <p v-if="state === 'ready'">You can use the script here.</p>
</template>

<script lang="ts" setup>
import { useScript } from "vhooks-ts";

const { state } = useScript(`https://code.jquery.com/jquery-3.5.1.min.js`, {
  removeOnUnmount: false,
});
</script>
```

## Hook

```js
import { type Ref, ref, onMounted, watchEffect } from 'vue'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export default function UseScript(
  defaultValue: string,
  options: {
    shouldPreventLoad?: boolean
    removeOnUnmount?: boolean
  }
): {
  state: Ref<Status | undefined>
} {
  const cache = ref<{ [src: string]: 'idle' | 'loading' | 'ready' | 'error' }>({})
  const state = ref<Status>()

  onMounted(() => {
    state.value = get()
  })

  const get = () => {
    if (!defaultValue || options?.shouldPreventLoad) {
      return 'idle'
    }

    if (typeof window === 'undefined') {
      return 'loading'
    }

    return cache.value[defaultValue] ?? 'loading'
  }

  watchEffect(() => {
    if (!defaultValue || options?.shouldPreventLoad) {
      return
    }

    const cachedStatus = cache.value[defaultValue]
    if (cachedStatus === 'ready' || cachedStatus === 'error') {
      state.value = cachedStatus
      return
    }

    let scriptNode: HTMLScriptElement | null = document.querySelector(
      `script[src="${defaultValue}"]`
    )
    if (!scriptNode) {
      scriptNode = document.createElement('script')
      scriptNode.src = defaultValue
      scriptNode.async = true
      scriptNode.setAttribute('data-status', 'loading')
      document.body.appendChild(scriptNode)

      const handleChange = (event: Event) => {
        scriptNode?.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error')
      }
      scriptNode.addEventListener('load', handleChange)
      scriptNode.addEventListener('error', handleChange)
    } else {
      state.value = (scriptNode.getAttribute('data-status') as Status) ?? cachedStatus ?? 'loading'
    }

    const handleChange = (event: Event) => {
      const status = event.type === 'load' ? 'ready' : 'error'
      state.value = status
      cache.value[defaultValue] = status
    }
    scriptNode.addEventListener('load', handleChange)
    scriptNode.addEventListener('error', handleChange)

    return () => {
      if (scriptNode) {
        scriptNode.removeEventListener('load', handleChange)
        scriptNode.removeEventListener('error', handleChange)
      }

      if (scriptNode && options?.removeOnUnmount) {
        scriptNode.remove()
      }
    }
  })

  return {
    state
  }
}
```
