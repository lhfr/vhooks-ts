import { ref, Ref, unref, watchEffect } from "vue";

type Size = {
  width: number | undefined;
  height: number | undefined;
};

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: Ref<T>;
  onResize?: (size: Size) => void;
  box?:
    | Ref<"border-box" | "content-box" | "device-pixel-content-box">
    | "border-box"
    | "content-box"
    | "device-pixel-content-box";
};

const initialSize: Size = {
  width: undefined,
  height: undefined,
};

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>
): Ref<Size> {
  const { ref: element, box = "content-box" } = options;
  const size = ref<Size>(initialSize);
  const previousSize = ref<Size>({ ...initialSize });

  watchEffect(() => {
    if (!element.value) return;

    if (typeof window === "undefined" || !("ResizeObserver" in window)) return;

    const observer = new ResizeObserver(([entry]) => {
      const boxProp =
        box === "border-box"
          ? "borderBoxSize"
          : box === "device-pixel-content-box"
          ? "devicePixelContentBoxSize"
          : "contentBoxSize";

      const newWidth = extractSize(entry, boxProp, "inlineSize");
      const newHeight = extractSize(entry, boxProp, "blockSize");

      const hasChanged =
        previousSize.value.width !== newWidth ||
        previousSize.value.height !== newHeight;

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight };
        previousSize.value.width = newWidth;
        previousSize.value.height = newHeight;

        if (options.onResize) {
          options.onResize(newSize);
        } else {
          size.value = newSize;
        }
      }
    });

    observer.observe(element.value, { box: unref(box) });

    return () => {
      observer.disconnect();
    };
  });

  return size;
}

type BoxSizesKey = keyof Pick<
  ResizeObserverEntry,
  "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize"
>;

function extractSize(
  entry: ResizeObserverEntry,
  box: BoxSizesKey,
  sizeType: keyof ResizeObserverSize
): number | undefined {
  if (!entry[box]) {
    if (box === "contentBoxSize") {
      return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
    }
    return undefined;
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-ignore Support Firefox's non-standard behavior
      (entry[box][sizeType] as number);
}
