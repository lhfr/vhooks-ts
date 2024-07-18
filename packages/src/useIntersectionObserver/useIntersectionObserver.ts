import { ref, unref, Ref, toRefs, reactive, computed, watchEffect } from "vue";

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Ref<Element | Document | null> | Element | Document | null;
  rootMargin?: Ref<string> | string;
  threshold?: Ref<number | number[]> | number | number[];
  freezeOnceVisible?: Ref<boolean> | boolean;
  onChange?: (
    isIntersecting: boolean,
    entry: IntersectionObserverEntry
  ) => void;
  initialIsIntersecting?: Ref<boolean> | boolean;
};

type IntersectionReturn = {
  ref: (node?: Element | null) => void;
  isIntersecting: Ref<boolean>;
  entry?: Ref<IntersectionObserverEntry | undefined>;
};

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  onChange,
  initialIsIntersecting = false,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const curRef = ref<Element | null>(null);
  const state = reactive<State>({
    isIntersecting: unref(initialIsIntersecting),
    entry: undefined,
  });

  const frozen = computed(
    () => state.entry?.isIntersecting && unref(freezeOnceVisible)
  );

  watchEffect(() => {
    // Ensure we have a ref to observe
    if (!curRef.value) return;

    // Ensure the browser supports the Intersection Observer API
    if (!("IntersectionObserver" in window)) return;

    // Skip if frozen
    if (frozen.value) return;

    let unobserve: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some(
              (threshold) => entry.intersectionRatio >= threshold
            );

          state.isIntersecting = isIntersecting;
          state.entry = entry;

          if (onChange) {
            onChange(isIntersecting, entry);
          }

          if (isIntersecting && unref(freezeOnceVisible) && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      {
        threshold: unref(threshold),
        root: unref(root),
        rootMargin: unref(rootMargin),
      }
    );

    observer.observe(curRef.value);

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // ensures that if the observed element changes, the intersection observer is reinitialized
  const prevRef = ref<Element | null>(null);

  watchEffect(() => {
    if (
      !curRef.value &&
      state.entry?.target &&
      !unref(freezeOnceVisible) &&
      !frozen.value &&
      prevRef.value !== state.entry.target
    ) {
      prevRef.value = state.entry.target;
      state.isIntersecting = unref(initialIsIntersecting);
      state.entry = undefined;
    }
  });

  return {
    ref: (node?: Element | null) => {
      curRef.value = node;
    },
    ...toRefs(state),
  };
}
