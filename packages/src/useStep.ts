import { ref, Ref, computed } from "vue";

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

type UseStepActions = {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
  canGoToNextStep: Ref<boolean>;
  canGoToPrevStep: Ref<boolean>;
  setStep: Dispatch<SetStateAction<number>>;
};

type SetStepCallbackType = (step: number | ((step: number) => number)) => void;

export function useStep(maxStep: number): [Ref<number>, UseStepActions] {
  const currentStep = ref(1);

  const canGoToNextStep = computed(() => currentStep.value + 1 <= maxStep);
  const canGoToPrevStep = computed(() => currentStep.value - 1 > 0);

  const setStep: SetStepCallbackType = (step) => {
    // Allow value to be a function so we have the same API as useState
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
      reset,
    },
  ];
}
