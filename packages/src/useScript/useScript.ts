import { ref, unref, Ref, onMounted, onUnmounted, watchEffect } from "vue";

type UseScriptStatus = "idle" | "loading" | "ready" | "error";

type UseScriptOptions = {
  shouldPreventLoad?: boolean;
  removeOnUnmount?: boolean;
  id?: string;
};

// Cached script statuses
const cachedScriptStatuses = new Map<string, UseScriptStatus | undefined>();

function getScriptNode(src: string) {
  const node: HTMLScriptElement | null = document.querySelector(
    `script[src="${src}"]`
  );
  const status = node?.getAttribute("data-status") as
    | UseScriptStatus
    | undefined;

  return {
    node,
    status,
  };
}

export function useScript(
  src: Ref<string | null> | string | null,
  options?: Ref<UseScriptOptions>
): Ref<UseScriptStatus> {
  const status = ref<UseScriptStatus>(
    (() => {
      if (!src || unref(options)?.shouldPreventLoad) {
        return "idle";
      }

      if (typeof window === "undefined") {
        // SSR Handling - always return 'loading'
        return "loading";
      }

      return cachedScriptStatuses.get(unref(src)) ?? "loading";
    })()
  );

  watchEffect(() => {
    if (!unref(src) || unref(options)?.shouldPreventLoad) {
      return;
    }

    const cachedScriptStatus = cachedScriptStatuses.get(unref(src));
    if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
      // If the script is already cached, set its status immediately
      status.value = cachedScriptStatus;
      return;
    }

    // Fetch existing script element by src
    // It may have been added by another instance of this hook
    const script = getScriptNode(unref(src));
    let scriptNode = script.node;

    if (!scriptNode) {
      // Create script element and add it to document body
      scriptNode = document.createElement("script");
      scriptNode.src = unref(src);
      scriptNode.async = true;
      if (unref(options)?.id) {
        scriptNode.id = unref(options).id;
      }
      scriptNode.setAttribute("data-status", "loading");
      document.body.appendChild(scriptNode);

      // Store status in attribute on script
      // This can be read by other instances of this hook
      const setAttributeFromEvent = (event: Event) => {
        const scriptStatus: UseScriptStatus =
          event.type === "load" ? "ready" : "error";

        scriptNode?.setAttribute("data-status", scriptStatus);
      };

      scriptNode.addEventListener("load", setAttributeFromEvent);
      scriptNode.addEventListener("error", setAttributeFromEvent);
    } else {
      // Grab existing script status from attribute and set to state.
      status.value = script.status ?? cachedScriptStatus ?? "loading";
    }

    // Script event handler to update status in state
    // Note: Even if the script already exists we still need to add
    // event handlers to update the state for *this* hook instance.
    const setStateFromEvent = (event: Event) => {
      const newStatus = event.type === "load" ? "ready" : "error";
      status.value = newStatus;
      cachedScriptStatuses.set(unref(src), newStatus);
    };

    // Add event listeners
    scriptNode.addEventListener("load", setStateFromEvent);
    scriptNode.addEventListener("error", setStateFromEvent);

    // Remove event listeners on cleanup
    onUnmounted(() => {
      if (scriptNode) {
        scriptNode.removeEventListener("load", setStateFromEvent);
        scriptNode.removeEventListener("error", setStateFromEvent);
      }

      if (scriptNode && unref(options)?.removeOnUnmount) {
        scriptNode.remove();
        cachedScriptStatuses.delete(unref(src));
      }
    });
  });

  return status;
}
