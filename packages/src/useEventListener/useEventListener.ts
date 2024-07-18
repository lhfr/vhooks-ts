import { unref, Ref, watchEffect } from "vue";

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: Ref<K> | K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: Ref<MediaQueryList>,
  options?:
    | Ref<boolean | AddEventListenerOptions>
    | boolean
    | AddEventListenerOptions
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: Ref<K> | K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?:
    | Ref<boolean | AddEventListenerOptions>
    | boolean
    | AddEventListenerOptions
): void;

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap
    ? HTMLDivElement
    : SVGElement
>(
  eventName: Ref<K> | K,
  handler:
    | ((event: HTMLElementEventMap[K]) => void)
    | ((event: SVGElementEventMap[K]) => void),
  element: Ref<T>,
  options?:
    | Ref<boolean | AddEventListenerOptions>
    | boolean
    | AddEventListenerOptions
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: Ref<K> | K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Ref<Document>,
  options?:
    | Ref<boolean | AddEventListenerOptions>
    | boolean
    | AddEventListenerOptions
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | SVGAElement | MediaQueryList = HTMLElement
>(
  eventName: Ref<KW | KH | KM> | KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | SVGElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event
  ) => void,
  element?: Ref<T>,
  options?:
    | Ref<boolean | AddEventListenerOptions>
    | boolean
    | AddEventListenerOptions
) {
  watchEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.value ?? window;

    if (!(targetElement && targetElement.addEventListener)) return;

    targetElement.addEventListener(unref(eventName), handler, unref(options));

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(
        unref(eventName),
        handler,
        unref(options)
      );
    };
  });
}

export { useEventListener };
