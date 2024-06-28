import { ref, Ref, watchEffect } from "vue";

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  onChange?: (
    isIntersecting: boolean,
    entry: IntersectionObserverEntry
  ) => void;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [
  Ref<Element | null>,
  boolean,
  IntersectionObserverEntry | undefined
] & {
  ref: Ref<Element | null>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const curRef = ref<Element | null>(null);

  const state = ref<State>({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  });

  const frozen = state.value.entry?.isIntersecting && freezeOnceVisible;

  watchEffect(() => {
    // Ensure we have a ref to observe
    if (!curRef.value) return;

    // Ensure the browser supports the Intersection Observer API
    if (!("IntersectionObserver" in window)) return;

    // Skip if frozen
    if (frozen) return;

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

          state.value = { isIntersecting, entry };

          if (onChange) {
            onChange(isIntersecting, entry);
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin }
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
      state.value.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.value !== state.value.entry.target
    ) {
      prevRef.value = state.value.entry.target;
      state.value = { isIntersecting: initialIsIntersecting, entry: undefined };
    }
  });

  const result = [
    curRef,
    !!state.value.isIntersecting,
    state.value.entry,
  ] as IntersectionReturn;

  // Support object destructuring, by adding the specific values.
  result.ref = result[0];
  result.isIntersecting = result[1];
  result.entry = result[2];

  return result;
}
