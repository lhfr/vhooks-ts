<template>
  <div>
    The current window dimensions are:
    <code>{{ JSON.stringify(screen, null, 2) }}</code>
  </div>
</template>

<script setup lang="ts">
import { useScreen } from "vhooks-ts";

const screen = useScreen();
</script>
