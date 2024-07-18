<template>
  <div>
    <p>Current theme: {{ isDarkMode ? "dark" : "light" }}</p>
    <button @click="toggle">Toggle</button>
    <button @click="enable">Enable</button>
    <button @click="disable">Disable</button>
  </div>
</template>

<script setup lang="ts">
import { useDarkMode } from "vhooks-ts";

const { isDarkMode, toggle, enable, disable } = useDarkMode();
</script>
