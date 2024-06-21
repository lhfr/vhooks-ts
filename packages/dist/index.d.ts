import { Ref } from 'vue';

declare function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, element?: undefined, options?: boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof HTMLElementEventMap>(eventName: K, handler: (event: HTMLElementEventMap[K]) => void, element: Ref<HTMLElement>, options?: boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof DocumentEventMap>(eventName: K, handler: (event: DocumentEventMap[K]) => void, element: Ref<Document>, options?: boolean | AddEventListenerOptions): void;

export { useEventListener };
