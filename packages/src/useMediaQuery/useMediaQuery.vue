<template>
  <div>
    {{
      `The view port is ${matches ? "at least" : "less than"} 768 pixels wide`
    }}
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from "vhooks-ts";

const matches = useMediaQuery("(min-width: 768px)");
</script>
