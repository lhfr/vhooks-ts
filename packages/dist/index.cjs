'use strict';

var vue = require('vue');

// src/useEventListener.ts
function useEventListener(eventName, handler, element, options) {
  const handlerRef = vue.ref(handler);
  vue.watchEffect(() => {
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

exports.useEventListener = useEventListener;
