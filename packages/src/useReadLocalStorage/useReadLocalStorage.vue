<template>
  <p>DarkMode is {{ darkMode ? "enabled" : "disabled" }}</p>
</template>

<script setup lang="ts">
import { useReadLocalStorage } from "vhooks-ts";

// Assuming a value was set in localStorage with this key
const darkMode = useReadLocalStorage("darkMode");
</script>
