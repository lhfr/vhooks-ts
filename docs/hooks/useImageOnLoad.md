# useImageOnLoad

一个简单的 Vue Hook，可以帮助您在加载图像时提高用户体验。我们不是让图像从上到下“展开”，而是先加载一个较小的版本，该版本将被模糊，加载后将被正常大小的图像取代。

## Usage

```vue
<template>
  <div :style="style.wrap">
    <!-- Small image loads fast -->
    <img
      :style="{ ...style.image, ...state.thumbnail }"
      src="https://via.placeholder.com/150"
      alt="thumbnail"
    />
    <!-- Full size image -->
    <img
      @load="set"
      :style="{ ...style.image, ...state.fullSize }"
      src="https://via.placeholder.com/600"
      alt="fullImage"
    />
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties } from "vue";
import { useImageOnLoad } from "vhooks-ts";

const style: { [key: string]: CSSProperties } = {
  wrap: {
    position: "relative",
    width: "400px",
    height: "400px",
    margin: "auto",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
};

const { state, set } = useImageOnLoad();
</script>
```

## Hook

```js
import { ref, type Ref, computed, type CSSProperties } from 'vue'

interface ImageStyle {
  thumbnail: CSSProperties
  fullSize: CSSProperties
}

interface Action {
  state: Ref<ImageStyle>
  set: () => void
}

export default function useImageOnLoad(): Action {
  const isLoaded = ref(false)

  const state: Ref<ImageStyle> = computed(() => ({
    thumbnail: {
      visibility: isLoaded.value ? 'hidden' : 'visible',
      filter: 'blur(8px)',
      transition: 'visibility 0ms ease-out 500ms'
    },
    fullSize: {
      opacity: isLoaded.value ? 1 : 0,
      transition: 'opacity 500ms ease-in 0ms'
    }
  }))

  const set = () => {
    isLoaded.value = true
  }

  return {
    state,
    set
  }
}
```
