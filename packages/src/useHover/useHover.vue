<template>
  <div ref="hoverRef">
    {{ `The current div is ${isHover ? "hovered" : "unhovered"}` }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHover } from "usehooks-ts";

const hoverRef = ref(null);
const isHover = useHover(hoverRef);
</script>
