<template>
  <div>
    <p>Debounced value: {{ value }}</p>

    <input
      type="text"
      v-modal="value"
      @change="(event) => debounced(event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDebounceCallback } from "vhooks-ts";

const value = ref("");

const debounced = useDebounceCallback((value) => {
  value.value = value;
}, 500);
</script>
