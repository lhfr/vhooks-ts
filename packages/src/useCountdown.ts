import { Ref, watchEffect } from "vue";

import { useBoolean } from "./useBoolean";
import { useCounter } from "./useCounter";
import { useInterval } from "./useInterval";

type CountdownOptions = {
  countStart: number;

  intervalMs?: number;
  isIncrement?: boolean;

  countStop?: number;
};

type CountdownControllers = {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
};

export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): [Ref<number>, CountdownControllers] {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
  } = useCounter(countStart);

  /*
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval.
   */
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false);

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = () => {
    stopCountdown();
    resetCounter();
  };

  const countdownCallback = () => {
    if (count.value === countStop) {
      stopCountdown();
      return;
    }

    if (isIncrement) {
      increment();
    } else {
      decrement();
    }
  };

  watchEffect(() => {
    useInterval(
      countdownCallback,
      isCountdownRunning.value ? intervalMs : null
    );
  });

  return [count, { startCountdown, stopCountdown, resetCountdown }];
}
