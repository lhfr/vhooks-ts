<template>
  <div>
    The current window dimensions are: <code>{{ width }}, {{ height }}</code>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from "vhooks-ts";

const { width = 0, height = 0 } = useWindowSize();
</script>
