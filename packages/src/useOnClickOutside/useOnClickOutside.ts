import { Ref } from "vue";

import { useEventListener } from "vhooks-ts";

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: Ref<T> | Ref<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: Ref<EventType> | EventType = "mousedown",
  eventListenerOptions:
    | Ref<AddEventListenerOptions>
    | AddEventListenerOptions = {}
): void {
  useEventListener(
    eventType,
    (event) => {
      const target = event.target as Node;

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter((r) => Boolean(r.value))
            .every((r) => r.value && !r.value.contains(target))
        : ref.value && !ref.value.contains(target);

      if (isOutside) {
        handler(event);
      }
    },
    undefined,
    eventListenerOptions
  );
}
