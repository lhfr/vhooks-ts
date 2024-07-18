import { ref, computed, unref, watch, watchEffect, onMounted, onUnmounted, reactive, toRefs } from 'vue';
import { useEventListener, useCounter, useBoolean as useBoolean$1, useInterval, useMediaQuery, useLocalStorage, useDebounceCallback as useDebounceCallback$1 } from 'vhooks-ts';
import debounce from 'lodash.debounce';

// src/useBoolean/useBoolean.ts
function useBoolean(defaultValue = false) {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const value = ref(defaultValue);
  const setValue = (x) => {
    value.value = x instanceof Function ? x(value.value) : x;
  };
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((x) => !x);
  return { value, setValue, setTrue, setFalse, toggle };
}
function useClickAnyWhere(handler) {
  useEventListener("click", (event) => {
    handler(event);
  });
}
function useCopyToClipboard() {
  const copiedText = ref(null);
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
  } = useCounter(countStart);
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown
  } = useBoolean$1(false);
  const resetCountdown = () => {
    stopCountdown();
    resetCounter();
  };
  const countdownCallback = () => {
    if (count.value === countStop) {
      stopCountdown();
      return;
    }
    if (unref(isIncrement)) {
      increment();
    } else {
      decrement();
    }
  };
  useInterval(
    countdownCallback,
    computed(() => isCountdownRunning.value ? unref(intervalMs) : null)
  );
  return [count, { startCountdown, stopCountdown, resetCountdown }];
}
function useCounter2(initialValue) {
  const count = ref(initialValue ?? 0);
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
    setCount(unref(initialValue) ?? 0);
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
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue,
    defaultValue
  });
  const [isDarkMode, setDarkMode] = useLocalStorage(
    localStorageKey,
    defaultValue ?? isDarkOS.value ?? false,
    { initializeWithValue }
  );
  watch(isDarkOS, () => {
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
  const debouncedFunc = ref();
  const debounced = computed(() => {
    const debouncedFuncInstance = debounce(
      unref(func),
      unref(delay),
      unref(options)
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
  watchEffect(() => {
    debouncedFunc.value = debounce(unref(func), unref(delay), unref(options));
  });
  return debounced;
}
function useDebounceValue(initialValue, delay, options) {
  const eq = computed(
    () => {
      var _a;
      return ((_a = unref(options)) == null ? void 0 : _a.equalityFn) ?? ((left, right) => left === right);
    }
  );
  const unwrappedInitialValue = computed(() => {
    const value = unref(initialValue);
    return value instanceof Function ? value() : value;
  });
  const debouncedValue = ref(unwrappedInitialValue.value);
  const previousValueRef = ref(
    unwrappedInitialValue.value
  );
  const updateDebouncedValue = useDebounceCallback$1(
    (value) => {
      debouncedValue.value = value;
    },
    unref(delay),
    unref(options)
  );
  watchEffect(() => {
    if (!eq.value(previousValueRef.value, unwrappedInitialValue.value)) {
      updateDebouncedValue.value(unwrappedInitialValue);
      previousValueRef.value = unwrappedInitialValue.value;
    }
  });
  return [debouncedValue, updateDebouncedValue];
}
function useDocumentTitle(title, options = {}) {
  const { preserveTitleOnUnmount = true } = options;
  const defaultTitle = ref(null);
  onMounted(() => {
    defaultTitle.value = window.document.title;
  });
  watchEffect(() => {
    window.document.title = unref(title);
  });
  onUnmounted(() => {
    if (!preserveTitleOnUnmount && defaultTitle.value) {
      window.document.title = defaultTitle.value;
    }
  });
}
function useEventListener2(eventName, handler, element, options) {
  watchEffect(() => {
    const targetElement = (element == null ? void 0 : element.value) ?? window;
    if (!(targetElement && targetElement.addEventListener)) return;
    targetElement.addEventListener(unref(eventName), handler, unref(options));
    return () => {
      targetElement.removeEventListener(
        unref(eventName),
        handler,
        unref(options)
      );
    };
  });
}
function useHover(elementRef) {
  const value = ref(false);
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
function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  onChange,
  initialIsIntersecting = false
} = {}) {
  const curRef = ref(null);
  const state = reactive({
    isIntersecting: unref(initialIsIntersecting),
    entry: void 0
  });
  const frozen = computed(
    () => {
      var _a;
      return ((_a = state.entry) == null ? void 0 : _a.isIntersecting) && unref(freezeOnceVisible);
    }
  );
  watchEffect(() => {
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
          if (isIntersecting && unref(freezeOnceVisible) && unobserve) {
            unobserve();
            unobserve = void 0;
          }
        });
      },
      {
        threshold: unref(threshold),
        root: unref(root),
        rootMargin: unref(rootMargin)
      }
    );
    observer.observe(curRef.value);
    return () => {
      observer.disconnect();
    };
  });
  const prevRef = ref(null);
  watchEffect(() => {
    var _a;
    if (!curRef.value && ((_a = state.entry) == null ? void 0 : _a.target) && !unref(freezeOnceVisible) && !frozen.value && prevRef.value !== state.entry.target) {
      prevRef.value = state.entry.target;
      state.isIntersecting = unref(initialIsIntersecting);
      state.entry = void 0;
    }
  });
  return {
    ref: (node) => {
      curRef.value = node;
    },
    ...toRefs(state)
  };
}
var id;
function useInterval2(callback, delay) {
  const savedCallback = ref(callback);
  watchEffect(() => {
    savedCallback.value = callback;
    if (unref(delay) === null) {
      clearInterval(id);
      return;
    }
    id = setInterval(() => {
      savedCallback.value();
    }, unref(delay));
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
    const defaultValue = computed(() => {
      const value2 = unref(initialValue);
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
    const initialValueToUse = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    if (IS_SERVER) {
      return initialValueToUse.value;
    }
    try {
      const raw = window.localStorage.getItem(unref(key));
      return raw ? deserializer(raw) : initialValueToUse.value;
    } catch (error) {
      console.warn(`Error reading localStorage key \u201C${unref(key)}\u201D:`, error);
      return initialValueToUse.value;
    }
  };
  const storedValue = ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }
      const value = unref(initialValue);
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
      window.localStorage.setItem(unref(key), serializer(newValue));
      storedValue.value = newValue;
      window.dispatchEvent(
        new StorageEvent("local-storage", { key: unref(key) })
      );
    } catch (error) {
      console.warn(`Error setting localStorage key \u201C${unref(key)}\u201D:`, error);
    }
  };
  const removeValue = () => {
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key \u201C${unref(
          key
        )}\u201D even though environment is not a client`
      );
    }
    const defaultValue = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    window.localStorage.removeItem(unref(key));
    storedValue.value = defaultValue.value;
    window.dispatchEvent(
      new StorageEvent("local-storage", { key: unref(key) })
    );
  };
  watchEffect(() => {
    storedValue.value = readValue();
  });
  const handleStorageChange = (event) => {
    if (event.key && event.key !== unref(key)) {
      return;
    }
    storedValue.value = readValue();
  };
  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);
  return [storedValue, setValue, removeValue];
}
function useMap(initialState = /* @__PURE__ */ new Map()) {
  const map = ref(new Map(initialState));
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
  const matches = ref(
    initializeWithValue ? getMatches(unref(query)) : defaultValue
  );
  function handleChange() {
    matches.value = getMatches(unref(query));
  }
  watchEffect(() => {
    const matchMedia = window.matchMedia(unref(query));
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
  useEventListener(
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
  const storedValue = ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }
      return void 0;
    })()
  );
  watchEffect(() => {
    storedValue.value = readValue();
  });
  const handleStorageChange = (event) => {
    if (event.key && event.key !== key) {
      return;
    }
    storedValue.value = readValue();
  };
  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);
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
  const screen = ref(
    initializeWithValue ? readScreen() : void 0
  );
  const debouncedSetScreen = useDebounceCallback$1(
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
  useEventListener("resize", handleSize);
  onMounted(() => {
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
  const status = ref(
    (() => {
      var _a;
      if (!src || ((_a = unref(options)) == null ? void 0 : _a.shouldPreventLoad)) {
        return "idle";
      }
      if (typeof window === "undefined") {
        return "loading";
      }
      return cachedScriptStatuses.get(unref(src)) ?? "loading";
    })()
  );
  watchEffect(() => {
    var _a, _b;
    if (!unref(src) || ((_a = unref(options)) == null ? void 0 : _a.shouldPreventLoad)) {
      return;
    }
    const cachedScriptStatus = cachedScriptStatuses.get(unref(src));
    if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
      status.value = cachedScriptStatus;
      return;
    }
    const script = getScriptNode(unref(src));
    let scriptNode = script.node;
    if (!scriptNode) {
      scriptNode = document.createElement("script");
      scriptNode.src = unref(src);
      scriptNode.async = true;
      if ((_b = unref(options)) == null ? void 0 : _b.id) {
        scriptNode.id = unref(options).id;
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
      cachedScriptStatuses.set(unref(src), newStatus);
    };
    scriptNode.addEventListener("load", setStateFromEvent);
    scriptNode.addEventListener("error", setStateFromEvent);
    onUnmounted(() => {
      var _a2;
      if (scriptNode) {
        scriptNode.removeEventListener("load", setStateFromEvent);
        scriptNode.removeEventListener("error", setStateFromEvent);
      }
      if (scriptNode && ((_a2 = unref(options)) == null ? void 0 : _a2.removeOnUnmount)) {
        scriptNode.remove();
        cachedScriptStatuses.delete(unref(src));
      }
    });
  });
  return status;
}
var IS_SERVER5 = typeof window === "undefined";
function useScrollLock(options = {}) {
  const { autoLock = true, lockTarget, widthReflow = true } = options;
  const isLocked = ref(false);
  const target = ref(null);
  const originalStyle = ref(null);
  const lock = () => {
    if (target.value) {
      const { overflow, paddingRight } = target.value.style;
      originalStyle.value = { overflow, paddingRight };
      if (unref(widthReflow)) {
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
      if (unref(widthReflow)) {
        target.value.style.paddingRight = originalStyle.value.paddingRight;
      }
    }
    isLocked.value = false;
  };
  watchEffect(() => {
    if (IS_SERVER5) return;
    const value = unref(lockTarget);
    if (value) {
      target.value = typeof value === "string" ? document.querySelector(value) : value;
    }
    if (!target.value) {
      target.value = document.body;
    }
    if (unref(autoLock)) {
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
    const defaultValue = computed(() => {
      const value2 = unref(initialValue);
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
    const initialValueToUse = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    if (IS_SERVER6) {
      return initialValueToUse.value;
    }
    try {
      const raw = window.sessionStorage.getItem(unref(key));
      return raw ? deserializer(raw) : initialValueToUse.value;
    } catch (error) {
      console.warn(`Error reading sessionStorage key \u201C${unref(key)}\u201D:`, error);
      return initialValueToUse.value;
    }
  };
  const storedValue = ref(
    (() => {
      if (initializeWithValue) {
        return readValue();
      }
      const value = unref(initialValue);
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
      window.sessionStorage.setItem(unref(key), serializer(newValue));
      storedValue.value = newValue;
      window.dispatchEvent(
        new StorageEvent("session-storage", { key: unref(key) })
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
    const defaultValue = computed(() => {
      const value = unref(initialValue);
      return value instanceof Function ? value() : value;
    });
    window.sessionStorage.removeItem(unref(key));
    storedValue.value = defaultValue.value;
    window.dispatchEvent(
      new StorageEvent("session-storage", { key: unref(key) })
    );
  };
  watchEffect(() => {
    storedValue.value = readValue();
  });
  const handleStorageChange = (event) => {
    if (event.key && event.key !== unref(key)) {
      return;
    }
    storedValue.value = readValue();
  };
  useEventListener("storage", handleStorageChange);
  useEventListener("session-storage", handleStorageChange);
  return [storedValue, setValue, removeValue];
}
function useStep(maxStep) {
  const currentStep = ref(1);
  const canGoToNextStep = computed(() => currentStep.value + 1 <= maxStep);
  const canGoToPrevStep = computed(() => currentStep.value - 1 > 0);
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
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY2, { initializeWithValue });
  const [mode, setMode] = useLocalStorage(localStorageKey, defaultValue, {
    initializeWithValue
  });
  const isDarkMode = computed(
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
  const savedCallback = ref(callback);
  watchEffect(() => {
    savedCallback.value = callback;
    if (unref(delay) === null) {
      clearTimeout(id2);
      return;
    }
    id2 = setTimeout(() => {
      savedCallback.value();
    }, unref(delay));
    return () => {
      clearTimeout(id2);
    };
  });
}
function useToggle(defaultValue) {
  const value = ref(!!defaultValue);
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
  const windowSize = reactive(
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
  const debouncedSetWindowSize = useDebounceCallback$1((value) => {
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
  useEventListener("resize", handleSize);
  onMounted(() => {
    handleSize();
  });
  return {
    ...toRefs(windowSize)
  };
}

export { useBoolean, useClickAnyWhere, useCopyToClipboard, useCountdown, useCounter2 as useCounter, useDarkMode, useDebounceCallback, useDebounceValue, useDocumentTitle, useEventListener2 as useEventListener, useHover, useIntersectionObserver, useInterval2 as useInterval, useLocalStorage2 as useLocalStorage, useMap, useMediaQuery2 as useMediaQuery, useOnClickOutside, useReadLocalStorage, useScreen, useScript, useScrollLock, useSessionStorage, useStep, useTernaryDarkMode, useTimeout, useToggle, useWindowSize };
