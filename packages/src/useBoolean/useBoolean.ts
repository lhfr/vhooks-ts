import { ref, Ref } from "vue";

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

type UseBooleanReturn = {
  value: Ref<boolean>;
  setValue: Dispatch<SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const value = ref(defaultValue);
  const setValue: Dispatch<SetStateAction<boolean>> = (x) => {
    value.value = x instanceof Function ? x(value.value) : x;
  };

  const setTrue = () => setValue(true);

  const setFalse = () => setValue(false);

  const toggle = () => setValue((x) => !x);

  return { value, setValue, setTrue, setFalse, toggle };
}
