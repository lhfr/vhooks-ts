import { ref, Ref } from "vue";

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);

export function useToggle(
  defaultValue?: boolean
): [Ref<boolean>, () => void, Dispatch<SetStateAction<boolean>>] {
  const value = ref(!!defaultValue);
  const setValue = (x: boolean) => {
    value.value = x;
  };

  const toggle = () => {
    value.value = !value.value;
  };

  return [value, toggle, setValue];
}
