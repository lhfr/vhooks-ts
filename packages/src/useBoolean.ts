import { ref, Ref } from "vue";

type UseBooleanReturn = {
  value: Ref<boolean>;
  setValue: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const value = ref(defaultValue);
  const setValue = (x: boolean | ((x: boolean) => boolean)) => {
    value.value = typeof x === "boolean" ? x : x(value.value);
  };

  const setTrue = () => setValue(true);

  const setFalse = () => setValue(false);

  const toggle = () => setValue((x) => !x);

  return { value, setValue, setTrue, setFalse, toggle };
}
