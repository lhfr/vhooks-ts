<template>
  <div>
    <div id="scrollable" style="max-height: 50vh; overflow: scroll">
      <div
        v-for="color in ['red', 'blue', 'green']"
        :key="color"
        :style="{ backgroundColor: color, height: '30vh' }"
      />
    </div>

    <div style="gap: 16px; display: flex">
      <button @click="lock">Lock</button>
      <button @click="unlock">Unlock</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScrollLock } from "vhooks-ts";

const { lock, unlock } = useScrollLock({
  autoLock: false,
  lockTarget: "#scrollable",
});
</script>
