# useIntersectionObserver

该 Vue Hook 使用浏览器中本机存在的 IntersectionObserver API 来检测组件在视口上的可见性。

## Usage

```vue
<template>
  <Section
    v-for="(_, index) in Array.from({ length: 5 })"
    :key="index + 1"
    :title="`${index + 1}`"
  />
</template>

<script lang="tsx" setup>
import { ref, watchEffect } from "vue";
import { useIntersectionObserver } from "vhooks-ts";

const Section = ({ title }) => {
  const sectionRef = ref(null);
  const { state } = useIntersectionObserver(sectionRef, {});

  watchEffect(() => {
    const isVisible = state.value?.isIntersecting;
    console.log(`Render Section ${title}`, isVisible);
  });

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        border: "1px dashed #000",
        fontSize: "2rem",
      }}
    >
      <div style={{ margin: "auto" }}>{title}</div>
    </div>
  );
};
</script>
```

## Hook

```js
import { type Ref, ref, watchEffect } from 'vue'

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export default function useIntersectionObserver<T extends HTMLElement>(
  element: Ref<T>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false
  }: IntersectionObserverOptions
): {
  state: Ref<IntersectionObserverEntry | undefined>
} {
  const state = ref<IntersectionObserverEntry>()

  watchEffect(() => {
    if (!window.IntersectionObserver || !element.value || freezeOnceVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.value = entry
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element.value)

    return () => observer.disconnect()
  })

  return {
    state
  }
}
```
