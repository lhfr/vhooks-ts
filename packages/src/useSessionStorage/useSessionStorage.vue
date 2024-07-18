<template>
  <div>
    <p>Count: {{ value }}</p>
    <button @click="setValue((x) => x + 1)">Increment</button>
    <button @click="setValue((x) => x - 1)">Decrement</button>
    <button @click="removeValue">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSessionStorage } from "vhooks-ts";

const [value, setValue, removeValue] = useSessionStorage("test-key", 0);
</script>
