import { useEventListener } from "vhooks-ts";

export function useClickAnyWhere(handler: (event: MouseEvent) => void) {
  useEventListener("click", (event) => {
    handler(event);
  });
}
