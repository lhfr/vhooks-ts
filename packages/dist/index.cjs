'use strict';

var vue = require('vue');
var vhooksTs = require('vhooks-ts');
var debounce = require('lodash.debounce');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var debounce__default = /*#__PURE__*/_interopDefault(debounce);

// src/useBoolean/useBoolean.ts
function useBoolean(defaultValue = false) {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const value = vue.ref(defaultValue);
  const setValue = (x) => {
    value.value = x instanceof Function ? x(value.value) : x;
  };
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((x) => !x);
  return { value, setValue, setTrue, setFalse, toggle };
}
function useClickAnyWhere(handler) {
  vhooksTs.useEventListener("click", (event) => {
    handler(event);
  });
}
function useCopyToClipboard() {
  const copiedText = vue.ref(null);
  const copy = async (text) => {
    if (!(navigator == null ? void 0 : navigator.clipboard)) {
      console.warn("Clipboard not supported");
      return false;
    }
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
function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1e3,
  isIncrement = false
}) {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter
  } = vhooksTs.useCounter(countStart);
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown
  } = vhooksTs.useBoolean(false);
  const resetCountdown = () => {
    stopCountdown();
    resetCounter();
  };
  const countdownCallback = () => {
    if (count.value === countStop) {
      stopCountdown();
      return;
    }
    if (vue.unref(isIncrement)) {
      increment();
    } else {
      decrement();
    }
  };
  vhooksTs.useInterval(
    countdownCallback,
    vue.computed(() => isCountdownRunning.value ? vue.unref(intervalMs) : null)
  );
  return [count, { startCountdown, stopCountdown, resetCountdown }];
}
function useCounter2(initialValue) {
  const count = vue.ref(initialValue ?? 0);
  const setCount = (x) => {
    count.value = x instanceof Function ? x(count.value) : x;
  };
  const increment = () => {
    setCount((x) => x + 1);
  };
  const decrement = () => {
    setCount((x) => x - 1);
  };
  const reset = () => {
    setCount(vue.unref(initialValue) ?? 0);
  };
  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  };
}
var COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
var LOCAL_STORAGE_KEY = "vhooks-ts-dark-mode";
function useDarkMode(options = {}) {
  const {
    defaultValue,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true
  } = options;
  const isDarkOS = vhooksTs.useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue,
    defaultValue
  });
  const [isDarkMode, setDarkMode] = vhooksTs.useLocalStorage(
    localStorageKey,
    defaultValue ?? isDarkOS.value ?? false,
    { initializeWithValue }
  );
  vue.watch(isDarkOS, () => {
    if (isDarkOS.value !== isDarkMode.value) {
      setDarkMode(isDarkOS.value);
    }
  });
  return {
    isDarkMode,
    toggle: () => {
      setDarkMode((prev) => !prev);
    },
    enable: () => {
      setDarkMode(true);
    },
    disable: () => {
      setDarkMode(false);
    },
    set: (value) => {
      setDarkMode(value);
    }
  };
}
function useDebounceCallback(func, delay = 500, options) {
  const debouncedFunc = vue.ref();
  const debounced = vue.computed(() => {
    const debouncedFuncInstance = debounce__default.default(
      vue.unref(func),
      vue.unref(delay),
      vue.unref(options)
    );
    const wrappedFunc = (...args) => {
      return debouncedFuncInstance(...args);
    };
    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };
    wrappedFunc.isPending = () => {
      return !!debouncedFunc.value;
    };
    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };
    return wrappedFunc;
  });
  vue.watchEffect(() => {
    debouncedFunc.value = debounce__default.default(vue.unref(func), vue.unref(delay), vue.unref(options));
  });
  return debounced;
}
function useDebounceValue(initialValue, delay, options) {
  const eq = vue.computed(
    () => {
      var _a;
      return ((_a = vue.unref(options)) == null ? void 0 : _a.equalityFn) ?? ((left, right) => left === right);
    }
  );
  const unwrappedInitialValue = vue.computed(() => {
    const value = vue.unref(initialValue);
    return value instanceof Function ? value() : value;
  });
  const debouncedValue = vue.ref(unwrappedInitialValue.value);
  const previousValueRef = vue.ref(
    unwrappedInitialValue.value
  );
  const updateDebouncedValue = vhooksTs.useDebounceCallback(
    (value) => {
      debouncedValue.value = value;
    },
    vue.unref(delay),
    vue.unref(options)
  );
  vue.watchEffect(() => {
    if (!eq.value(previousValueRef.value, unwrappedInitialValue.value)) {
      updateDebouncedValue.value(unwrappedInitialValue);
      previousValueRef.value = unwrappedInitialValue.value;
    }
  });
  return [debouncedValue, updateDebouncedValue];
}
function useDocumentTitle(title, options = {}) {
  const { preserveTitleOnUnmount = true } = options;
  const defaultTitle = vue.ref(null);
  vue.onMounted(() => {
    defaultTitle.value = window.document.title;
  });
  vue.watchEffect(() => {
    window.document.title = vue.unref(title);
  });
  vue.onUnmounted(() => {
    if (!preserveTitleOnUnmount && defaultTitle.value) {
      window.document.title = defaultTitle.value;
    }
  });
}
function useEventListener2(eventName, handler, element, options) {
  vue.watchEffect(() => {
    const targetElement = (element == null ? void 0 : element.value) ?? window;
    if (!(targetElement && targetElement.addEventListener)) return;
    targetElement.addEventListener(vue.unref(eventName), handler, vue.unref(options));
    return () => {
      targetElement.removeEventListener(
        vue.unref(eventName),
        handler,
        vue.unref(options)
      );
    };
  });
}
function useHover(elementRef) {
  const value = vue.ref(false);
  const handleMouseEnter = () => {
    value.value = true;
  };
  const handleMouseLeave = () => {
    value.value = false;
  };
  vhooksTs.useEventListener("mouseenter", handleMouseEnter, elementRef);
  vhooksTs.useEventListener("mouseleave", handleMouseLeave, elementRef);
  return value;
}
function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  onChange,
  initialIsIntersecting = false
} = {}) {
  const curRef = vue.ref(null);
  const state = vue.reactive({
    isIntersecting: vue.unref(initialIsIntersecting),
    entry: void 0
  });
  const frozen = vue.computed(
    () => {
      var _a;
      return ((_a = state.entry) == null ? void 0 : _a.isIntersecting) && vue.unref(freezeOnceVisible);
    }
  );
  vue.watchEffect(() => {
    if (!curRef.value) return;
    if (!("IntersectionObserver" in window)) return;
    if (frozen.value) return;
    let unobserve;
    const observer = new IntersectionObserver(
      (entries) => {
        const thresholds = Array.isArray(observer.thresholds) ? observer.thresholds : [observer.thresholds];
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting && thresholds.some(
            (threshold2) => entry.intersectionRatio >= threshold2
          );
          state.isIntersecting = isIntersecting;
          state.entry = entry;
          if (onChange) {
            onChange(isIntersecting, entry);
          }
          if (isIntersecting && vue.unref(freezeOnceVisible) && unobserve) {
            unobserve();
            unobserve = void 0;
          }
        });
      },
      {
        threshold: vue.unref(threshold),
        root: vue.unref(root),
        rootMargin: vue.unref(rootMargin)
      }
    );
    observer.observe(curRef.value);
    return () => {
      observer.disconnect();
    };
  });
  const prevRef = vue.ref(null);
  vue.watchEffect(() => {
    var _a;
    if (!curRef.value && ((_a = state.entry) == null ? void 0 : _a.target) && !vue.unref(freezeOnceVisible) && !frozen.value && prevRef.value !== state.entry.target) {
      prevRef.value = state.entry.target;
      state.isIntersecting = vue.unref(initialIsIntersecting);
      state.entry = void 0;
    }
  });
  return {
    ref: (node) => {
      curRef.value = node;
    },
    ...vue.toRefs(state)
  };
}
var id;
function useInterval2(callback, delay) {
  const savedCallback = vue.ref(callback);
  vue.watchEffect(() => {
    savedCallback.value = callback;
    if (vue.unref(delay) === null) {
      clearInterval(id);
      return;
    }
    id = setInterval(() => {
      savedCallback.value();
    }, vue.unref(delay));
    return () => {
      clearInterval(id);
    };
  });
}
var IS_SERVER = typeof window === "undefined";
function useLocalStorage2(key, initialValue, options = {}) {
  const { initializeWithValue = true } = options;
  const serializer = (value) => {
    if (options.serializer) {
      return options.serializer(value);
    }
    return JSON.stringify(value);
  };
  const deserializer = (value) => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    if (value === "undefined") {
      return void 0;
    }
    const defaultValue = vue.computed(() => {
      const value2 = vue.unref(initialValue);
      return value2 instanceof Function ? value2() : value2;
    });
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return defaultValue.value;
    }
    return parsed;
  };
  const readValue = () => {
    const initialValueToUse = vue.computed(() => {
      const value = vue.unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    if (IS_SERVER) {
      return initialValueToUse.value;
    }
    try {
      const raw = window.localStorage.getItem(vue.unref(key));
      return raw ? deserializer(raw) : initialValueToUse.value;
    } catch (error) {
      console.warn(`Error reading localStorage key \u201C${vue.unref(key)}\u201D:`, error);
      return initialValueToUse.value;
    }
  };
  const storedValue = vue.ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }
      const value = vue.unref(initialValue);
      return value instanceof Function ? value() : value;
    })()
  );
  const setValue = (value) => {
    if (IS_SERVER) {
      console.warn(
        `Tried setting localStorage key \u201C${key}\u201D even though environment is not a client`
      );
    }
    try {
      const newValue = value instanceof Function ? value(readValue()) : value;
      window.localStorage.setItem(vue.unref(key), serializer(newValue));
      storedValue.value = newValue;
      window.dispatchEvent(
        new StorageEvent("local-storage", { key: vue.unref(key) })
      );
    } catch (error) {
      console.warn(`Error setting localStorage key \u201C${vue.unref(key)}\u201D:`, error);
    }
  };
  const removeValue = () => {
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key \u201C${vue.unref(
          key
        )}\u201D even though environment is not a client`
      );
    }
    const defaultValue = vue.computed(() => {
      const value = vue.unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    window.localStorage.removeItem(vue.unref(key));
    storedValue.value = defaultValue.value;
    window.dispatchEvent(
      new StorageEvent("local-storage", { key: vue.unref(key) })
    );
  };
  vue.watchEffect(() => {
    storedValue.value = readValue();
  });
  const handleStorageChange = (event) => {
    if (event.key && event.key !== vue.unref(key)) {
      return;
    }
    storedValue.value = readValue();
  };
  vhooksTs.useEventListener("storage", handleStorageChange);
  vhooksTs.useEventListener("local-storage", handleStorageChange);
  return [storedValue, setValue, removeValue];
}
function useMap(initialState = /* @__PURE__ */ new Map()) {
  const map = vue.ref(new Map(initialState));
  const actions = {
    set: (key, value) => {
      const copy = new Map(map.value);
      copy.set(key, value);
      map.value = copy;
    },
    setAll: (entries) => {
      map.value = new Map(entries);
    },
    remove: (key) => {
      const copy = new Map(map.value);
      copy.delete(key);
      map.value = copy;
    },
    reset: () => {
      map.value = /* @__PURE__ */ new Map();
    }
  };
  return [map, actions];
}
var IS_SERVER2 = typeof window === "undefined";
function useMediaQuery2(query, {
  defaultValue = false,
  initializeWithValue = true
} = {}) {
  const getMatches = (query2) => {
    if (IS_SERVER2) {
      return defaultValue;
    }
    return window.matchMedia(query2).matches;
  };
  const matches = vue.ref(
    initializeWithValue ? getMatches(vue.unref(query)) : defaultValue
  );
  function handleChange() {
    matches.value = getMatches(vue.unref(query));
  }
  vue.watchEffect(() => {
    const matchMedia = window.matchMedia(vue.unref(query));
    handleChange();
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }
    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  });
  return matches;
}
function useOnClickOutside(ref21, handler, eventType = "mousedown", eventListenerOptions = {}) {
  vhooksTs.useEventListener(
    eventType,
    (event) => {
      const target = event.target;
      if (!target || !target.isConnected) {
        return;
      }
      const isOutside = Array.isArray(ref21) ? ref21.filter((r) => Boolean(r.value)).every((r) => r.value && !r.value.contains(target)) : ref21.value && !ref21.value.contains(target);
      if (isOutside) {
        handler(event);
      }
    },
    void 0,
    eventListenerOptions
  );
}
var IS_SERVER3 = typeof window === "undefined";
function useReadLocalStorage(key, options = {}) {
  let { initializeWithValue = true } = options;
  if (IS_SERVER3) {
    initializeWithValue = false;
  }
  const deserializer = (value) => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    if (value === "undefined") {
      return void 0;
    }
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
    return parsed;
  };
  const readValue = () => {
    if (IS_SERVER3) {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key \u201C${key}\u201D:`, error);
      return null;
    }
  };
  const storedValue = vue.ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }
      return void 0;
    })()
  );
  vue.watchEffect(() => {
    storedValue.value = readValue();
  });
  const handleStorageChange = (event) => {
    if (event.key && event.key !== key) {
      return;
    }
    storedValue.value = readValue();
  };
  vhooksTs.useEventListener("storage", handleStorageChange);
  vhooksTs.useEventListener("local-storage", handleStorageChange);
  return storedValue;
}
var IS_SERVER4 = typeof window === "undefined";
function useScreen(options = {}) {
  let { initializeWithValue = true } = options;
  if (IS_SERVER4) {
    initializeWithValue = false;
  }
  const readScreen = () => {
    if (IS_SERVER4) {
      return void 0;
    }
    return window.screen;
  };
  const screen = vue.ref(
    initializeWithValue ? readScreen() : void 0
  );
  const debouncedSetScreen = vhooksTs.useDebounceCallback(
    (value) => screen.value = value,
    options.debounceDelay
  );
  function handleSize() {
    const newScreen = readScreen();
    const setSize = options.debounceDelay ? debouncedSetScreen.value : (value) => screen.value = value;
    if (newScreen) {
      const {
        width,
        height,
        availHeight,
        availWidth,
        colorDepth,
        orientation,
        pixelDepth
      } = newScreen;
      setSize({
        width,
        height,
        availHeight,
        availWidth,
        colorDepth,
        orientation,
        pixelDepth
      });
    }
  }
  vhooksTs.useEventListener("resize", handleSize);
  vue.onMounted(() => {
    handleSize();
  });
  return screen;
}
var cachedScriptStatuses = /* @__PURE__ */ new Map();
function getScriptNode(src) {
  const node = document.querySelector(
    `script[src="${src}"]`
  );
  const status = node == null ? void 0 : node.getAttribute("data-status");
  return {
    node,
    status
  };
}
function useScript(src, options) {
  const status = vue.ref(
    (() => {
      var _a;
      if (!src || ((_a = vue.unref(options)) == null ? void 0 : _a.shouldPreventLoad)) {
        return "idle";
      }
      if (typeof window === "undefined") {
        return "loading";
      }
      return cachedScriptStatuses.get(vue.unref(src)) ?? "loading";
    })()
  );
  vue.watchEffect(() => {
    var _a, _b;
    if (!vue.unref(src) || ((_a = vue.unref(options)) == null ? void 0 : _a.shouldPreventLoad)) {
      return;
    }
    const cachedScriptStatus = cachedScriptStatuses.get(vue.unref(src));
    if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
      status.value = cachedScriptStatus;
      return;
    }
    const script = getScriptNode(vue.unref(src));
    let scriptNode = script.node;
    if (!scriptNode) {
      scriptNode = document.createElement("script");
      scriptNode.src = vue.unref(src);
      scriptNode.async = true;
      if ((_b = vue.unref(options)) == null ? void 0 : _b.id) {
        scriptNode.id = vue.unref(options).id;
      }
      scriptNode.setAttribute("data-status", "loading");
      document.body.appendChild(scriptNode);
      const setAttributeFromEvent = (event) => {
        const scriptStatus = event.type === "load" ? "ready" : "error";
        scriptNode == null ? void 0 : scriptNode.setAttribute("data-status", scriptStatus);
      };
      scriptNode.addEventListener("load", setAttributeFromEvent);
      scriptNode.addEventListener("error", setAttributeFromEvent);
    } else {
      status.value = script.status ?? cachedScriptStatus ?? "loading";
    }
    const setStateFromEvent = (event) => {
      const newStatus = event.type === "load" ? "ready" : "error";
      status.value = newStatus;
      cachedScriptStatuses.set(vue.unref(src), newStatus);
    };
    scriptNode.addEventListener("load", setStateFromEvent);
    scriptNode.addEventListener("error", setStateFromEvent);
    vue.onUnmounted(() => {
      var _a2;
      if (scriptNode) {
        scriptNode.removeEventListener("load", setStateFromEvent);
        scriptNode.removeEventListener("error", setStateFromEvent);
      }
      if (scriptNode && ((_a2 = vue.unref(options)) == null ? void 0 : _a2.removeOnUnmount)) {
        scriptNode.remove();
        cachedScriptStatuses.delete(vue.unref(src));
      }
    });
  });
  return status;
}
var IS_SERVER5 = typeof window === "undefined";
function useScrollLock(options = {}) {
  const { autoLock = true, lockTarget, widthReflow = true } = options;
  const isLocked = vue.ref(false);
  const target = vue.ref(null);
  const originalStyle = vue.ref(null);
  const lock = () => {
    if (target.value) {
      const { overflow, paddingRight } = target.value.style;
      originalStyle.value = { overflow, paddingRight };
      if (vue.unref(widthReflow)) {
        const offsetWidth = target.value === document.body ? window.innerWidth : target.value.offsetWidth;
        const currentPaddingRight = parseInt(window.getComputedStyle(target.value).paddingRight, 10) || 0;
        const scrollbarWidth = offsetWidth - target.value.scrollWidth;
        target.value.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`;
      }
      target.value.style.overflow = "hidden";
      isLocked.value = true;
    }
  };
  const unlock = () => {
    if (target.value && originalStyle.value) {
      target.value.style.overflow = originalStyle.value.overflow;
      if (vue.unref(widthReflow)) {
        target.value.style.paddingRight = originalStyle.value.paddingRight;
      }
    }
    isLocked.value = false;
  };
  vue.watchEffect(() => {
    if (IS_SERVER5) return;
    const value = vue.unref(lockTarget);
    if (value) {
      target.value = typeof value === "string" ? document.querySelector(value) : value;
    }
    if (!target.value) {
      target.value = document.body;
    }
    if (vue.unref(autoLock)) {
      lock();
    }
    return () => {
      unlock();
    };
  });
  return { isLocked, lock, unlock };
}
var IS_SERVER6 = typeof window === "undefined";
function useSessionStorage(key, initialValue, options = {}) {
  const { initializeWithValue = true } = options;
  const serializer = (value) => {
    if (options.serializer) {
      return options.serializer(value);
    }
    return JSON.stringify(value);
  };
  const deserializer = (value) => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    if (value === "undefined") {
      return void 0;
    }
    const defaultValue = vue.computed(() => {
      const value2 = vue.unref(initialValue);
      return value2 instanceof Function ? value2() : value2;
    });
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return defaultValue.value;
    }
    return parsed;
  };
  const readValue = () => {
    const initialValueToUse = vue.computed(() => {
      const value = vue.unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    if (IS_SERVER6) {
      return initialValueToUse.value;
    }
    try {
      const raw = window.sessionStorage.getItem(vue.unref(key));
      return raw ? deserializer(raw) : initialValueToUse.value;
    } catch (error) {
      console.warn(`Error reading sessionStorage key \u201C${vue.unref(key)}\u201D:`, error);
      return initialValueToUse.value;
    }
  };
  const storedValue = vue.ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }
      const value = vue.unref(initialValue);
      return value instanceof Function ? value() : value;
    })()
  );
  const setValue = (value) => {
    if (IS_SERVER6) {
      console.warn(
        `Tried setting sessionStorage key \u201C${key}\u201D even though environment is not a client`
      );
    }
    try {
      const newValue = value instanceof Function ? value(readValue()) : value;
      window.sessionStorage.setItem(vue.unref(key), serializer(newValue));
      storedValue.value = newValue;
      window.dispatchEvent(
        new StorageEvent("session-storage", { key: vue.unref(key) })
      );
    } catch (error) {
      console.warn(`Error setting sessionStorage key \u201C${key}\u201D:`, error);
    }
  };
  const removeValue = () => {
    if (IS_SERVER6) {
      console.warn(
        `Tried removing sessionStorage key \u201C${key}\u201D even though environment is not a client`
      );
    }
    const defaultValue = vue.computed(() => {
      const value = vue.unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    window.sessionStorage.removeItem(vue.unref(key));
    storedValue.value = defaultValue.value;
    window.dispatchEvent(
      new StorageEvent("session-storage", { key: vue.unref(key) })
    );
  };
  vue.watchEffect(() => {
    storedValue.value = readValue();
  });
  const handleStorageChange = (event) => {
    if (event.key && event.key !== vue.unref(key)) {
      return;
    }
    storedValue.value = readValue();
  };
  vhooksTs.useEventListener("storage", handleStorageChange);
  vhooksTs.useEventListener("session-storage", handleStorageChange);
  return [storedValue, setValue, removeValue];
}
function useStep(maxStep) {
  const currentStep = vue.ref(1);
  const canGoToNextStep = vue.computed(() => currentStep.value + 1 <= maxStep);
  const canGoToPrevStep = vue.computed(() => currentStep.value - 1 > 0);
  const setStep = (step) => {
    const newStep = step instanceof Function ? step(currentStep.value) : step;
    if (newStep >= 1 && newStep <= maxStep) {
      currentStep.value = newStep;
      return;
    }
    throw new Error("Step not valid");
  };
  const goToNextStep = () => {
    if (canGoToNextStep.value) {
      currentStep.value++;
    }
  };
  const goToPrevStep = () => {
    if (canGoToPrevStep.value) {
      currentStep.value--;
    }
  };
  const reset = () => {
    currentStep.value = 1;
  };
  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset
    }
  ];
}
var COLOR_SCHEME_QUERY2 = "(prefers-color-scheme: dark)";
var LOCAL_STORAGE_KEY2 = "vhooks-ts-ternary-dark-mode";
function useTernaryDarkMode({
  defaultValue = "system",
  localStorageKey = LOCAL_STORAGE_KEY2,
  initializeWithValue = true
} = {}) {
  const isDarkOS = vhooksTs.useMediaQuery(COLOR_SCHEME_QUERY2, { initializeWithValue });
  const [mode, setMode] = vhooksTs.useLocalStorage(localStorageKey, defaultValue, {
    initializeWithValue
  });
  const isDarkMode = vue.computed(
    () => mode.value === "dark" || mode.value === "system" && isDarkOS.value
  );
  const toggleTernaryDarkMode = () => {
    const modes = ["light", "system", "dark"];
    setMode((prevMode) => {
      const nextIndex = (modes.indexOf(prevMode) + 1) % modes.length;
      return modes[nextIndex];
    });
  };
  return {
    isDarkMode,
    ternaryDarkMode: mode,
    setTernaryDarkMode: setMode,
    toggleTernaryDarkMode
  };
}
var id2;
function useTimeout(callback, delay) {
  const savedCallback = vue.ref(callback);
  vue.watchEffect(() => {
    savedCallback.value = callback;
    if (vue.unref(delay) === null) {
      clearTimeout(id2);
      return;
    }
    id2 = setTimeout(() => {
      savedCallback.value();
    }, vue.unref(delay));
    return () => {
      clearTimeout(id2);
    };
  });
}
function useToggle(defaultValue) {
  const value = vue.ref(!!defaultValue);
  const setValue = (x) => {
    value.value = x;
  };
  const toggle = () => {
    value.value = !value.value;
  };
  return [value, toggle, setValue];
}
var IS_SERVER7 = typeof window === "undefined";
function useWindowSize(options = {}) {
  let { initializeWithValue = true } = options;
  if (IS_SERVER7) {
    initializeWithValue = false;
  }
  const windowSize = vue.reactive(
    (() => {
      if (initializeWithValue) {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
      return {
        width: void 0,
        height: void 0
      };
    })()
  );
  const debouncedSetWindowSize = vhooksTs.useDebounceCallback((value) => {
    windowSize.width = value.width;
    windowSize.height = value.height;
  }, options.debounceDelay);
  function handleSize() {
    const setSize = options.debounceDelay ? debouncedSetWindowSize.value : (value) => {
      windowSize.width = value.width;
      windowSize.height = value.height;
    };
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  vhooksTs.useEventListener("resize", handleSize);
  vue.onMounted(() => {
    handleSize();
  });
  return {
    ...vue.toRefs(windowSize)
  };
}

exports.useBoolean = useBoolean;
exports.useClickAnyWhere = useClickAnyWhere;
exports.useCopyToClipboard = useCopyToClipboard;
exports.useCountdown = useCountdown;
exports.useCounter = useCounter2;
exports.useDarkMode = useDarkMode;
exports.useDebounceCallback = useDebounceCallback;
exports.useDebounceValue = useDebounceValue;
exports.useDocumentTitle = useDocumentTitle;
exports.useEventListener = useEventListener2;
exports.useHover = useHover;
exports.useIntersectionObserver = useIntersectionObserver;
exports.useInterval = useInterval2;
exports.useLocalStorage = useLocalStorage2;
exports.useMap = useMap;
exports.useMediaQuery = useMediaQuery2;
exports.useOnClickOutside = useOnClickOutside;
exports.useReadLocalStorage = useReadLocalStorage;
exports.useScreen = useScreen;
exports.useScript = useScript;
exports.useScrollLock = useScrollLock;
exports.useSessionStorage = useSessionStorage;
exports.useStep = useStep;
exports.useTernaryDarkMode = useTernaryDarkMode;
exports.useTimeout = useTimeout;
exports.useToggle = useToggle;
exports.useWindowSize = useWindowSize;
