# useDocumentTitle

设置当前文档标题的简单方法。

## Usage

```vue
<script lang="ts" setup>
import { useDocumentTitle } from "vhooks-ts";

useDocumentTitle("foo bar");
</script>
```

## Hook

```js
import { type Ref, watchEffect, unref } from "vue";

export default function useDocumentTitle(defaultValue: string | Ref<string>) {
  watchEffect(() => {
    window.document.title = unref(defaultValue);
  });
}
```
