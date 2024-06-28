import { ref, Ref, watchEffect } from "vue";

type UseScrollLockOptions = {
  autoLock?: boolean;
  lockTarget?: HTMLElement | string;
  widthReflow?: boolean;
};

type UseScrollLockReturn = {
  isLocked: Ref<boolean>;
  lock: () => void;
  unlock: () => void;
};

type OriginalStyle = {
  overflow: CSSStyleDeclaration["overflow"];
  paddingRight: CSSStyleDeclaration["paddingRight"];
};

const IS_SERVER = typeof window === "undefined";

export function useScrollLock(
  options: UseScrollLockOptions = {}
): UseScrollLockReturn {
  const { autoLock = true, lockTarget, widthReflow = true } = options;
  const isLocked = ref(false);
  const target = ref<HTMLElement | null>(null);
  const originalStyle = ref<OriginalStyle | null>(null);

  const lock = () => {
    if (target.value) {
      const { overflow, paddingRight } = target.value.style;

      // Save the original styles
      originalStyle.value = { overflow, paddingRight };

      // Prevent width reflow
      if (widthReflow) {
        // Use window inner width if body is the target as global scrollbar isn't part of the document
        const offsetWidth =
          target.value === document.body
            ? window.innerWidth
            : target.value.offsetWidth;
        // Get current computed padding right in pixels
        const currentPaddingRight =
          parseInt(window.getComputedStyle(target.value).paddingRight, 10) || 0;

        const scrollbarWidth = offsetWidth - target.value.scrollWidth;
        target.value.style.paddingRight = `${
          scrollbarWidth + currentPaddingRight
        }px`;
      }

      // Lock the scroll
      target.value.style.overflow = "hidden";

      isLocked.value = true;
    }
  };

  const unlock = () => {
    if (target.value && originalStyle.value) {
      target.value.style.overflow = originalStyle.value.overflow;

      // Only reset padding right if we changed it
      if (widthReflow) {
        target.value.style.paddingRight = originalStyle.value.paddingRight;
      }
    }

    isLocked.value = false;
  };

  watchEffect(() => {
    if (IS_SERVER) return;

    if (lockTarget) {
      target.value =
        typeof lockTarget === "string"
          ? document.querySelector(lockTarget)
          : lockTarget;
    }

    if (!target.value) {
      target.value = document.body;
    }

    if (autoLock) {
      lock();
    }

    return () => {
      unlock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return { isLocked, lock, unlock };
}
