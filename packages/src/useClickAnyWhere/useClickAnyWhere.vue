<template>
  <div>
    <p>Click count: {{ count }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useClickAnyWhere } from "vhooks-ts";

const count = ref(0);

useClickAnyWhere(() => {
  count.value++;
});
</script>
