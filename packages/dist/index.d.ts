import { Ref } from 'vue';

type Dispatch$6<T> = (value: T) => void;
type SetStateAction$6<T> = T | ((value: T) => T);
type UseBooleanReturn = {
    value: Ref<boolean>;
    setValue: Dispatch$6<SetStateAction$6<boolean>>;
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
};
declare function useBoolean(defaultValue?: boolean): UseBooleanReturn;

declare function useClickAnyWhere(handler: (event: MouseEvent) => void): void;

type CopiedValue = Ref<string | null>;
type CopyFn = (text: string) => Promise<boolean>;
declare function useCopyToClipboard(): [CopiedValue, CopyFn];

type CountdownOptions = {
    countStart: number;
    intervalMs?: Ref<number> | number;
    isIncrement?: Ref<boolean> | boolean;
    countStop?: number;
};
type CountdownControllers = {
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: () => void;
};
declare function useCountdown({ countStart, countStop, intervalMs, isIncrement, }: CountdownOptions): [Ref<number>, CountdownControllers];

type Dispatch$5<T> = (value: T) => void;
type SetStateAction$5<T> = T | ((value: T) => T);
type UseCounterReturn = {
    count: Ref<number>;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    setCount: Dispatch$5<SetStateAction$5<number>>;
};
declare function useCounter(initialValue?: Ref<number> | number): UseCounterReturn;

type DarkModeOptions = {
    defaultValue?: boolean;
    localStorageKey?: Ref<string> | string;
    initializeWithValue?: boolean;
};
type DarkModeReturn = {
    isDarkMode: Ref<boolean>;
    toggle: () => void;
    enable: () => void;
    disable: () => void;
    set: (value: boolean) => void;
};
declare function useDarkMode(options?: DarkModeOptions): DarkModeReturn;

type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
};
type ControlFunctions = {
    cancel: () => void;
    flush: () => void;
    isPending: Ref<boolean>;
};
type DebouncedState<T extends (...args: any) => ReturnType<T>> = (...args: Parameters<T>) => ReturnType<T> | (undefined & ControlFunctions);
declare function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(func: Ref<T> | T, delay?: Ref<number> | number, options?: Ref<DebounceOptions> | DebounceOptions): Ref<DebouncedState<T>>;

type UseDebounceValueOptions<T> = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
    equalityFn?: (left: T, right: T) => boolean;
};
declare function useDebounceValue<T>(initialValue: Ref<T | (() => T)> | T | (() => T), delay: Ref<number> | number, options?: Ref<UseDebounceValueOptions<T>> | UseDebounceValueOptions<T>): [Ref<T>, Ref<DebouncedState<(value: T) => void>>];

type UseDocumentTitleOptions = {
    preserveTitleOnUnmount?: boolean;
};
declare function useDocumentTitle(title: Ref<string> | string, options?: UseDocumentTitleOptions): void;

declare function useEventListener<K extends keyof MediaQueryListEventMap>(eventName: Ref<K> | K, handler: (event: MediaQueryListEventMap[K]) => void, element: Ref<MediaQueryList>, options?: Ref<boolean | AddEventListenerOptions> | boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof WindowEventMap>(eventName: Ref<K> | K, handler: (event: WindowEventMap[K]) => void, element?: undefined, options?: Ref<boolean | AddEventListenerOptions> | boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof HTMLElementEventMap & keyof SVGElementEventMap, T extends Element = K extends keyof HTMLElementEventMap ? HTMLDivElement : SVGElement>(eventName: Ref<K> | K, handler: ((event: HTMLElementEventMap[K]) => void) | ((event: SVGElementEventMap[K]) => void), element: Ref<T>, options?: Ref<boolean | AddEventListenerOptions> | boolean | AddEventListenerOptions): void;
declare function useEventListener<K extends keyof DocumentEventMap>(eventName: Ref<K> | K, handler: (event: DocumentEventMap[K]) => void, element: Ref<Document>, options?: Ref<boolean | AddEventListenerOptions> | boolean | AddEventListenerOptions): void;

declare function useHover<T extends HTMLElement = HTMLElement>(elementRef: Ref<T>): Ref<boolean>;

type UseIntersectionObserverOptions = {
    root?: Ref<Element | Document | null> | Element | Document | null;
    rootMargin?: Ref<string> | string;
    threshold?: Ref<number | number[]> | number | number[];
    freezeOnceVisible?: Ref<boolean> | boolean;
    onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
    initialIsIntersecting?: Ref<boolean> | boolean;
};
type IntersectionReturn = {
    ref: (node?: Element | null) => void;
    isIntersecting: Ref<boolean>;
    entry?: Ref<IntersectionObserverEntry | undefined>;
};
declare function useIntersectionObserver({ threshold, root, rootMargin, freezeOnceVisible, onChange, initialIsIntersecting, }?: UseIntersectionObserverOptions): IntersectionReturn;

declare function useInterval(callback: () => void, delay: Ref<number | null> | number | null): void;

declare global {
    interface WindowEventMap {
        "local-storage": CustomEvent;
    }
}
type Dispatch$4<T> = (value: T) => void;
type SetStateAction$4<T> = T | ((value: T) => T);
type UseLocalStorageOptions<T> = {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
    initializeWithValue?: boolean;
};
declare function useLocalStorage<T>(key: Ref<string> | string, initialValue: Ref<T | (() => T)> | T | (() => T), options?: UseLocalStorageOptions<T>): [Ref<T>, Dispatch$4<SetStateAction$4<T>>, () => void];

type MapOrEntries<K, V> = Map<K, V> | [K, V][];
type UseMapActions<K, V> = {
    set: (key: K, value: V) => void;
    setAll: (entries: MapOrEntries<K, V>) => void;
    remove: (key: K) => void;
    reset: Map<K, V>["clear"];
};
type UseMapReturn<K, V> = [
    Ref<Omit<Map<K, V>, "set" | "clear" | "delete">>,
    UseMapActions<K, V>
];
declare function useMap<K, V>(initialState?: MapOrEntries<K, V>): UseMapReturn<K, V>;

type UseMediaQueryOptions = {
    defaultValue?: boolean;
    initializeWithValue?: boolean;
};
declare function useMediaQuery(query: Ref<string> | string, { defaultValue, initializeWithValue, }?: UseMediaQueryOptions): Ref<boolean>;

type EventType = "mousedown" | "mouseup" | "touchstart" | "touchend" | "focusin" | "focusout";
declare function useOnClickOutside<T extends HTMLElement = HTMLElement>(ref: Ref<T> | Ref<T>[], handler: (event: MouseEvent | TouchEvent | FocusEvent) => void, eventType?: Ref<EventType> | EventType, eventListenerOptions?: Ref<AddEventListenerOptions> | AddEventListenerOptions): void;

type Options<T, InitializeWithValue extends boolean | undefined> = {
    deserializer?: (value: string) => T;
    initializeWithValue: InitializeWithValue;
};
declare function useReadLocalStorage<T>(key: Ref<string> | string, options: Options<T, false>): Ref<T | null | undefined> | T | null | undefined;
declare function useReadLocalStorage<T>(key: string, options?: Partial<Options<T, true>>): Ref<T | null> | T | null;

type UseScreenOptions<InitializeWithValue extends boolean | undefined> = {
    initializeWithValue: InitializeWithValue;
    debounceDelay?: Ref<number> | number;
};
declare function useScreen(options: UseScreenOptions<false>): Ref<Screen | undefined>;
declare function useScreen(options?: Partial<UseScreenOptions<true>>): Ref<Screen>;

type UseScriptStatus = "idle" | "loading" | "ready" | "error";
type UseScriptOptions = {
    shouldPreventLoad?: boolean;
    removeOnUnmount?: boolean;
    id?: string;
};
declare function useScript(src: Ref<string | null> | string | null, options?: Ref<UseScriptOptions>): Ref<UseScriptStatus>;

type UseScrollLockOptions = {
    autoLock?: Ref<boolean> | boolean;
    lockTarget?: Ref<HTMLElement | string> | HTMLElement | string;
    widthReflow?: Ref<boolean> | boolean;
};
type UseScrollLockReturn = {
    isLocked: Ref<boolean>;
    lock: () => void;
    unlock: () => void;
};
declare function useScrollLock(options?: UseScrollLockOptions): UseScrollLockReturn;

declare global {
    interface WindowEventMap {
        "session-storage": CustomEvent;
    }
}
type Dispatch$3<T> = (value: T) => void;
type SetStateAction$3<T> = T | ((value: T) => T);
type UseSessionStorageOptions<T> = {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
    initializeWithValue?: boolean;
};
declare function useSessionStorage<T>(key: Ref<string> | string, initialValue: Ref<T | (() => T)> | T | (() => T), options?: UseSessionStorageOptions<T>): [Ref<T>, Dispatch$3<SetStateAction$3<T>>, () => void];

type Dispatch$2<T> = (value: T) => void;
type SetStateAction$2<T> = T | ((value: T) => T);
type UseStepActions = {
    goToNextStep: () => void;
    goToPrevStep: () => void;
    reset: () => void;
    canGoToNextStep: Ref<boolean>;
    canGoToPrevStep: Ref<boolean>;
    setStep: Dispatch$2<SetStateAction$2<number>>;
};
declare function useStep(maxStep: number): [Ref<number>, UseStepActions];

type Dispatch$1<T> = (value: T) => void;
type SetStateAction$1<T> = T | ((value: T) => T);
type TernaryDarkMode = "system" | "dark" | "light";
type TernaryDarkModeOptions = {
    defaultValue?: TernaryDarkMode;
    localStorageKey?: Ref<string> | string;
    initializeWithValue?: boolean;
};
type TernaryDarkModeReturn = {
    isDarkMode: Ref<boolean>;
    ternaryDarkMode: Ref<TernaryDarkMode>;
    setTernaryDarkMode: Dispatch$1<SetStateAction$1<TernaryDarkMode>>;
    toggleTernaryDarkMode: () => void;
};
declare function useTernaryDarkMode({ defaultValue, localStorageKey, initializeWithValue, }?: TernaryDarkModeOptions): TernaryDarkModeReturn;

declare function useTimeout(callback: () => void, delay: Ref<number | null> | number | null): void;

type Dispatch<T> = (value: T) => void;
type SetStateAction<T> = T | ((value: T) => T);
declare function useToggle(defaultValue?: boolean): [Ref<boolean>, () => void, Dispatch<SetStateAction<boolean>>];

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
    initializeWithValue: InitializeWithValue;
    debounceDelay?: Ref<number> | number;
};
type SizeReturn<T extends number | undefined = number | undefined> = {
    width: Ref<T>;
    height: Ref<T>;
};
declare function useWindowSize(options: UseWindowSizeOptions<false>): SizeReturn;
declare function useWindowSize(options?: Partial<UseWindowSizeOptions<true>>): SizeReturn<number>;

export { type DebouncedState, type TernaryDarkMode, type TernaryDarkModeOptions, type TernaryDarkModeReturn, useBoolean, useClickAnyWhere, useCopyToClipboard, useCountdown, useCounter, useDarkMode, useDebounceCallback, useDebounceValue, useDocumentTitle, useEventListener, useHover, useIntersectionObserver, useInterval, useLocalStorage, useMap, useMediaQuery, useOnClickOutside, useReadLocalStorage, useScreen, useScript, useScrollLock, useSessionStorage, useStep, useTernaryDarkMode, useTimeout, useToggle, useWindowSize };
