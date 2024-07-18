<template>
  <div style="min-height: 200vh">
    <button ref="buttonRef">Click me</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEventListener } from "vhooks-ts";

// Define button ref
const buttonRef = ref<HTMLButtonElement>(null);
const documentRef = ref<Document>(document);

const onScroll = (event: Event) => {
  console.log("window scrolled!", event);
};

const onClick = (event: Event) => {
  console.log("button clicked!", event);
};

const onVisibilityChange = (event: Event) => {
  console.log("doc visibility changed!", {
    isVisible: !document.hidden,
    event,
  });
};

// example with window based event
useEventListener("scroll", onScroll);

// example with document based event
useEventListener("visibilitychange", onVisibilityChange, documentRef);

// example with element based event
useEventListener("click", onClick, buttonRef);
</script>
