import { ref, Ref } from "vue";

type CopiedValue = Ref<string | null>;
type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const copiedText = ref<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      copiedText.value = text;
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      copiedText.value = null;
      return false;
    }
  };

  return [copiedText, copy];
}
