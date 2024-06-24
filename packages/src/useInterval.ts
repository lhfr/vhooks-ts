import { ref, unref, Ref, watchEffect } from "vue";

let id: number | NodeJS.Timeout;

export function useInterval(
  callback: () => void,
  delay: Ref<number | null> | number | null
) {
  const savedCallback = ref(callback);

  // Set up the interval.
  watchEffect(() => {
    savedCallback.value = callback;

    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
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
