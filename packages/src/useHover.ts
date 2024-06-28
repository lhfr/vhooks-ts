import { ref, Ref } from "vue";

import { useEventListener } from "./useEventListener";

export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: Ref<T>
): Ref<boolean> {
  const value = ref<boolean>(false);

  const handleMouseEnter = () => {
    value.value = true;
  };
  const handleMouseLeave = () => {
    value.value = false;
  };

  useEventListener("mouseenter", handleMouseEnter, elementRef);
  useEventListener("mouseleave", handleMouseLeave, elementRef);

  return value;
}
