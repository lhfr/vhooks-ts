import { ref, watchEffect } from 'vue';

// src/useEventListener.ts
function useEventListener(eventName, handler, element, options) {
  const handlerRef = ref(handler);
  watchEffect(() => {
    const targetElement = (element == null ? void 0 : element.value) ?? window;
    if (!(targetElement && targetElement.addEventListener)) return;
    const listener = (event) => {
      return handlerRef.value(event);
    };
    targetElement.addEventListener(eventName, listener, options);
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  });
}

export { useEventListener };
