import { ref, watchEffect, onMounted, onUnmounted } from "vue";

type UseDocumentTitleOptions = {
  preserveTitleOnUnmount?: boolean;
};

export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
): void {
  const { preserveTitleOnUnmount = true } = options;
  const defaultTitle = ref<string | null>(null);

  onMounted(() => {
    defaultTitle.value = window.document.title;
  });

  watchEffect(() => {
    window.document.title = title;
  });

  onUnmounted(() => {
    if (!preserveTitleOnUnmount && defaultTitle.value) {
      window.document.title = defaultTitle.value;
    }
  });
}
