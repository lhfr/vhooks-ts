# useEventListener

通过 Vue Hook 简单地使用 EventListener。

## Usage

```vue
<template>
  <button ref="buttonRef">Click me</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useEventListener } from "vhooks-ts";

const buttonRef = ref(null);

const onClick = (e) => {
  console.log("button clicked!", e);
};

useEventListener("click", onClick, buttonRef);
</script>
```

## Hook

```js
import { ref, type Ref, watchEffect } from 'vue'

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: Ref<HTMLElement>,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Ref<Document>,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<
  KH extends keyof HTMLElementEventMap,
  KD extends keyof DocumentEventMap,
  KW extends keyof WindowEventMap,
  T extends HTMLElement | Document
>(
  eventName: KH | KD | KW,
  handler: (
    event: HTMLElementEventMap[KH] | DocumentEventMap[KD] | WindowEventMap[KW] | Event
  ) => void,
  element?: Ref<T>,
  options?: boolean | AddEventListenerOptions
) {
  const handlerRef = ref(handler)

  watchEffect(() => {
    const targetElement = element?.value ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    const listener = (event: Event) => {
      return handlerRef.value(event)
    }

    targetElement.addEventListener(eventName, listener, options)

    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  })
}

export default useEventListener
```
